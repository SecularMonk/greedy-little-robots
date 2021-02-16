const mysql = require('mysql');
const helpers = require('./helperfunctions');

/* This is where the magic happens. Describes everything the bot needs to manage it's state,
monitor and save it's results and execeute trades. */
class TradingBot {

    constructor() {
        this.activePosition = false;
        this.TotalResult = 0;
        this.openPrice = 0;
        this.closePrice = 0;
        this.Money = 0;
        this.StartingMoney = 0;
        this.lastTradeResult = 0;
    }

    set TradeItem(TradeItem) {
        this._TradeItem = TradeItem;
    }

    /* Sets the starting money for the bot to the equivalent of ten times the current price
    of the item it's trading.  */
    setMoney() {
        helpers.getRecommendations(this._TradeItem).then((recommendations) => {
            this.Money = recommendations[4].Price * 10;
            this.StartingMoney = recommendations[4].Price *10;
        })
    }

    calculateReturn() {
        return ((this.Money / this.StartingMoney) * 100) - 100
    }    

    decideToOpenBuyPosition(recommendations) {
        try{
            if(recommendations[4].Suggestion === 'Strong Buy' && recommendations[3].Suggestion === 'Strong Buy' && (recommendations[2].Suggestion) === 'Buy' || recommendations[2].Suggestion === 'Strong Buy') {
            this.openPosition('Buy', recommendations[4].Price)
            }
        } catch(err) {
            throw err;
        }
    }

   decideToOpenSellPosition(recommendations) {
       try {
            if(recommendations[4].Suggestion === 'Strong Sell' && recommendations[3].Suggestion === 'Strong Sell' && (recommendations[2].Suggestion) === 'Sell' || recommendations[2].Suggestion === 'Strong Sell') {
                this.openPosition('Sell', recommendations[4].Price)
                }
        } catch(err) {
            throw err;
        }
    }

   decideToCloseBuyPosition(recommendations) {
        if(recommendations[4].Suggestion === 'Strong Sell' || recommendations[3].Suggestion === 'Strong Sell' || (recommendations[3].Suggestion === 'Sell' && recommendations[2].Suggestion === 'Sell')) {
            this.closePosition(this.positionType, recommendations[4].Price);
        }
   }

   decideToCloseSellPosition(recommendations) {
        if(recommendations[4].Suggestion === 'Strong Buy' || recommendations[3].Suggestion === 'Strong Buy' || (recommendations[3].Suggestion === 'Buy' && recommendations[2].Suggestion === 'Buy')) {
            this.closePosition(this.positionType, recommendations[4].Price);
        }
   }

    /* How the bots decide whether to open, close or do nothing. */
    evaluateConditions(recommendations) {
        if(!recommendations) {return}

        if(this.activePosition === false) {
            this.decideToOpenBuyPosition(recommendations)
            this.decideToOpenSellPosition(recommendations)
        }

        if(this.activePosition === true) {
            if(this.positionType === 'Buy') {
                this.decideToCloseBuyPosition(recommendations)
            }
            if(this.positionType === 'Sell') {
                this.decideToCloseSellPosition(recommendations)
        }
        }
    }

   /* Opens a position. Saves the purchase price, position type(buy/sell) and  amount purchased
   to the Bot's state. Changes activePosition to true to show a position is open. */
   openPosition(positionType, price) {
        this.activePosition = true;
        this.positionType = positionType;
        this.openPrice = parseFloat(price);
        console.log(`${positionType}ing ${this._TradeItem} at ${this.openPrice}. DateTime: ${helpers.getCurrentTimeInSQLFormat()}`)
        helpers.createNewTradeHistoryRecord(this._TradeItem, this.openPrice, positionType)
   }

   /* Closes the current position. Saves the result of the trade to the tradeHistory array as an object,
   which holds the trade item, amount bought/sold, purchase price, sell price, and result of the trade.
   Then clears the data from the state to start fresh. */
   closePosition(positionType, price) {
        this.activePosition = false;
        this.closePrice = parseFloat(price);

        if(positionType === 'Buy') {
            this.lastTradeResult = this.closePrice - this.openPrice;
        } else if(positionType === 'Sell') {
            this.lastTradeResult = this.openPrice - this.closePrice;
        }

        this.Money += this.lastTradeResult;
        
        console.log(`Closing ${positionType} order on ${this._TradeItem} at ${this.closePrice}. Result: ${this.lastTradeResult}. Total return: ${this.calculateReturn()}%`)

        this.positionType = '';

        helpers.updateTradeHistoryRecord(this._TradeItem, this.openPrice, this.closePrice, this.lastTradeResult)
   }
}

module.exports.TradingBot = TradingBot