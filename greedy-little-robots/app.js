const mysql = require('mysql')
const TradingBot = require('./tradingbots').TradingBot
const helpers = require('./helperfunctions')
const getTradeRecommendations = require('./suggestionFetcher').getTradeRecommendations

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "investingdata"
  });

con.connect(function(err) {
        if(err) throw err;
    });

function createTradingBots() {

    GBP_USD = new TradingBot();
    GBP_USD.TradeItem = 'GBP/USD'

    EUR_USD = new TradingBot();
    EUR_USD.TradeItem = 'EUR/USD'

    USD_JPY = new TradingBot();
    USD_JPY.TradeItem = 'USD/JPY'

    AUD_USD = new TradingBot();
    AUD_USD.TradeItem = 'AUD/USD'

    USD_CAD = new TradingBot();
    USD_CAD.TradeItem = 'USD/CAD'

    EUR_JPY = new TradingBot();
    EUR_JPY.TradeItem = 'EUR/JPY'

    EUR_CHF = new TradingBot();
    EUR_CHF.TradeItem = 'EUR/CHF'

    CAC_40 = new TradingBot();
    CAC_40.TradeItem = 'CAC 40'

    DAX = new TradingBot();
    DAX.TradeItem = 'DAX'

    DOW_JONES = new TradingBot();
    DOW_JONES.TradeItem = 'Dow Jones'

    FTSE_100 = new TradingBot();
    FTSE_100.TradeItem = 'FTSE 100'

    NASDAQ_100 = new TradingBot();
    NASDAQ_100.TradeItem = 'Nasdaq 100'

    NIKKEI_225 = new TradingBot();
    NIKKEI_225.TradeItem = 'Nikkei 225'

    SP500 = new TradingBot();
    SP500.TradeItem = 'S&P 500'

    BCH_USD = new TradingBot();
    BCH_USD.TradeItem = 'BCH/USD'

    BTC_EUR = new TradingBot();
    BTC_EUR.TradeItem = 'BTC/EUR'

    BTC_USD = new TradingBot();
    BTC_USD.TradeItem = 'BTC/USD'

    DASH_USD = new TradingBot();
    DASH_USD.TradeItem = 'DASH/USD'

    ETH_USD = new TradingBot();
    ETH_USD.TradeItem = 'ETH/USD'

    IOTA_USD = new TradingBot();
    IOTA_USD.TradeItem = 'IOTA/USD'

    LTC_USD = new TradingBot();
    LTC_USD.TradeItem = 'LTC/USD'

    XRP_USD = new TradingBot();
    XRP_USD.TradeItem = 'XRP/USD'
}

function app() {

    getTradeRecommendations();
    createTradingBots();
    
    let tradingBotsArray = 
    [GBP_USD, EUR_USD, USD_JPY, AUD_USD, USD_CAD, EUR_JPY, EUR_CHF,
    CAC_40, DAX, DOW_JONES, FTSE_100, NASDAQ_100, NIKKEI_225, SP500,
    BCH_USD, BTC_EUR, BTC_USD, DASH_USD, ETH_USD, IOTA_USD, LTC_USD, 
    XRP_USD]

    helpers.setFundsForTradingBots(tradingBotsArray);

    setInterval(() => {
        getTradeRecommendations()
        helpers.allBotsEvaluateThenTrade(tradingBotsArray);
    }, 60000)
}

app();