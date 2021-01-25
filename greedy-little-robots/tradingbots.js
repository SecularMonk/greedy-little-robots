const mysql = require('mysql');
const { promise } = require('selenium-webdriver');
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
        if(recommendations[4].Suggestion === 'Strong Buy' && recommendations[3].Suggestion === 'Strong Buy' && (recommendations[2].Suggestion) === 'Buy' || recommendations[2].Suggestion === 'Strong Buy') {
                this.openPosition('Buy', recommendations[4].Price, recommendations)
            }
        }

   decideToOpenSellPosition(recommendations) {
        if(recommendations[4].Suggestion === 'Strong Sell' && recommendations[3].Suggestion === 'Strong Sell' && (recommendations[2].Suggestion) === 'Sell' || recommendations[2].Suggestion === 'Strong Sell') {
        this.openPosition('Sell', recommendations[4].Price, recommendations)
            }
        }

   decideToCloseBuyPosition(recommendations) {
        if(recommendations[4].Suggestion === 'Strong Sell' || recommendations[3].Suggestion === 'Strong Sell' || (recommendations[3].Suggestion === 'Sell' && recommendations[2].Suggestion === 'Sell')) {
            this.closePosition(this.positionType, this.amount, this.price, recommendations);
        }
   }

   decideToCloseSellPosition(recommendations) {
        if(recommendations[4].Suggestion === 'Strong Buy' || recommendations[3].Suggestion === 'Strong Buy' || (recommendations[3].Suggestion === 'Buy' && recommendations[2].Suggestion === 'Buy')) {
            this.closePosition(this.positionType, this.amount, this.price, recommendations);
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
   openPosition(positionType, price, recommendations) {
        this.activePosition = true;
        this.positionType = positionType;
        this.openPrice = parseFloat(recommendations[4].Price);
        console.log(`${positionType}ing ${this.TradeItem} at ${price}. DateTime: ${helpers.getCurrentTimeInSQLFormat()}`)
        helpers.createNewTradeHistoryRecord(this.TradeItem, this.openPrice, positionType)
   }

   /* Closes the current position. Saves the result of the trade to the tradeHistory array as an object,
   which holds the trade item, amount bought/sold, purchase price, sell price, and result of the trade.
   Then clears the data from the state to start fresh. */
   closePosition(positionType, amount, price, recommendations) {
        if(positionType === 'Buy') {
            this.lastTradeResult = this.closePrice - this.openPrice;
        } else if(positionType === 'Sell') {
            this.lastTradeResult = this.openPrice - this.closePrice;
        }
        
        console.log(`Closing ${positionType} order on ${this.TradeItem} at ${recommendations[4].Price}. ${amount} units ${positionType==='Buy' ? 'sold' : 'bought'} Result: ${this.lastTradeResult}. Total return: ${this.calculateReturn()}%`)

        this.activePosition = false;
        this.closePrice = parseFloat(recommendations[4].Price);
        this.Money += this.lastTradeResult;
        this.positionType = '';

        helpers.updateTradeHistoryRecord(this.TradeItem, this.openPrice, this.closePrice, this.lastTradeResult)
   }
}

module.exports.TradingBot = TradingBot