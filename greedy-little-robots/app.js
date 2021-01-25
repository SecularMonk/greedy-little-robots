const mysql = require('mysql')
const TradingBot = require('./tradingbots').TradingBot
const helpers = require('./helperfunctions')
const getTradeItems = require('./tradingbots').getTradeItems
const getTradeRecommendations = require('./suggestionFetcher').getTradeRecommendations
const filterData = require('./suggestionFetcher').filterData
const storeReccomendationsLocally = require('./suggestionFetcher').storeReccomendationsLocally
const insertScrapedData = require('./suggestionFetcher').insertScrapedData

const GBP_USD = new TradingBot();
GBP_USD.TradeItem = 'GBP/USD'

const EUR_USD = new TradingBot();
EUR_USD.TradeItem = 'EUR/USD'

const USD_JPY = new TradingBot();
USD_JPY.TradeItem = 'USD/JPY'

const AUD_USD = new TradingBot();
AUD_USD.TradeItem = 'AUD/USD'

const USD_CAD = new TradingBot();
USD_CAD.TradeItem = 'USD/CAD'

const EUR_JPY = new TradingBot();
EUR_JPY.TradeItem = 'EUR/JPY'

const EUR_CHF = new TradingBot();
EUR_CHF.TradeItem = 'EUR/CHF'

const CAC_40 = new TradingBot();
CAC_40.TradeItem = 'CAC 40'

const DAX = new TradingBot();
DAX.TradeItem = 'DAX'

const DOW_JONES = new TradingBot();
DOW_JONES.TradeItem = 'Dow Jones'

const FTSE_100 = new TradingBot();
FTSE_100.TradeItem = 'FTSE 100'

const NASDAQ_100 = new TradingBot();
NASDAQ_100.TradeItem = 'Nasdaq 100'

const NIKKEI_225 = new TradingBot();
NIKKEI_225.TradeItem = 'Nikkei 225'

const SP500 = new TradingBot();
SP500.TradeItem = 'S&P 500'

const BCH_USD = new TradingBot();
BCH_USD.TradeItem = 'BCH/USD'

const BTC_EUR = new TradingBot();
BTC_EUR.TradeItem = 'BTC/EUR'

const BTC_USD = new TradingBot();
BTC_USD.TradeItem = 'BTC/USD'

const DASH_USD = new TradingBot();
DASH_USD.TradeItem = 'DASH/USD'

const ETH_USD = new TradingBot();
ETH_USD.TradeItem = 'ETH/USD'

const IOTA_USD = new TradingBot();
IOTA_USD.TradeItem = 'IOTA/USD'

const LTC_USD = new TradingBot();
LTC_USD.TradeItem = 'LTC/USD'

const XRP_USD = new TradingBot();
XRP_USD.TradeItem = 'XRP/USD'

/*
GBP_USD.calculateVolatility(GBP_USD.currencyPair).then((result) => console.log(result))
*/

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "investingdata"
  });

con.connect(function(err) {
        if(err) throw err;
    });

GBP_USD.setMoney();
EUR_USD.setMoney();
USD_JPY.setMoney();
AUD_USD.setMoney();
USD_CAD.setMoney();
EUR_JPY.setMoney();
EUR_CHF.setMoney();
CAC_40.setMoney();
DAX.setMoney();
DOW_JONES.setMoney();
FTSE_100.setMoney();
NASDAQ_100.setMoney();
NIKKEI_225.setMoney();
SP500.setMoney();
BCH_USD.setMoney();
BTC_EUR.setMoney();
BTC_USD.setMoney();
DASH_USD.setMoney();
ETH_USD.setMoney();
IOTA_USD.setMoney();
LTC_USD.setMoney();
XRP_USD.setMoney();

function app() {

    getTradeRecommendations()

    setInterval(() => {

    getTradeRecommendations()
 

    helpers.getRecommendations(GBP_USD._TradeItem).then((item) => GBP_USD.evaluateConditions(item))

    helpers.getRecommendations(EUR_USD._TradeItem).then((item) => EUR_USD.evaluateConditions(item))

    /*

    USD_JPY.getRecommendations(USD_JPY.TradeItem).then((item) => USD_JPY.evaluateConditions(item))

    AUD_USD.getRecommendations(AUD_USD.TradeItem).then((item) => AUD_USD.evaluateConditions(item))

    USD_CAD.getRecommendations(USD_CAD.TradeItem).then((item) => USD_CAD.evaluateConditions(item))

    EUR_JPY.getRecommendations(EUR_JPY.TradeItem).then((item) => EUR_JPY.evaluateConditions(item))

    EUR_CHF.getRecommendations(EUR_CHF.TradeItem).then((item) => EUR_CHF.evaluateConditions(item))

    CAC_40.getRecommendations(CAC_40.TradeItem).then((item) => CAC_40.evaluateConditions(item))

    DAX.getRecommendations(DAX.TradeItem).then((item) => DAX.evaluateConditions(item))

    DOW_JONES.getRecommendations(DOW_JONES.TradeItem).then((item) => DOW_JONES.evaluateConditions(item))

    FTSE_100.getRecommendations(FTSE_100.TradeItem).then((item) => FTSE_100.evaluateConditions(item))

    NASDAQ_100.getRecommendations(NASDAQ_100.TradeItem).then((item) => NASDAQ_100.evaluateConditions(item))

    NIKKEI_225.getRecommendations(NIKKEI_225.TradeItem).then((item) => NIKKEI_225.evaluateConditions(item))

    SP500.getRecommendations(SP500.TradeItem).then((item) => SP500.evaluateConditions(item))

    BCH_USD.getRecommendations(BCH_USD.TradeItem).then((item) => BCH_USD.evaluateConditions(item))

    BTC_EUR.getRecommendations(BTC_EUR.TradeItem).then((item) => BTC_EUR.evaluateConditions(item))

    BTC_USD.getRecommendations(BTC_USD.TradeItem).then((item) => BTC_USD.evaluateConditions(item))

    DASH_USD.getRecommendations(DASH_USD.TradeItem).then((item) => DASH_USD.evaluateConditions(item))

    ETH_USD.getRecommendations(ETH_USD.TradeItem).then((item) => ETH_USD.evaluateConditions(item))

    IOTA_USD.getRecommendations(IOTA_USD.TradeItem).then((item) => IOTA_USD.evaluateConditions(item))

    LTC_USD.getRecommendations(LTC_USD.TradeItem).then((item) => LTC_USD.evaluateConditions(item))

    XRP_USD.getRecommendations(XRP_USD.TradeItem).then((item) => XRP_USD.evaluateConditions(item))
*/
}, (60000));
}

app();