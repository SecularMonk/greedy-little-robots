const mysql = require('mysql')
const TradingBot = require('./tradingbots').TradingBot

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "investingdata"
  });

  con.connect(function(err) {
    if(err) throw err;
});

function getCurrentTimeInSQLFormat() {
    try {
        let date = new Date();   
        let datetime= date.toISOString().slice(0, 19).replace('T', ' '); 
        return datetime;
    } catch(err) {
        throw err;
    }
}

function runAsyncSQLQuery(sql) {
    try {
        return new Promise(function(resolve, reject) {
            con.query(sql, function(err, rows, fields) {
                if(err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    } catch(err) {
        throw err;
    }
}

  /* Connects to the database to return all the distinct trade items */
function getListOfTradeItemsFromDatabase() {
    try {
        let sql = `SELECT DISTINCT TradeItem, Class from scrapeddata ORDER BY Class DESC;`
        return runAsyncSQLQuery(sql);
    } catch(err) {
        throw err;
    }
}

/* Looks at each trade item individually to see how volatile it is.
    Volatility is how many times the suggestion has changed in a given time. */
function calculateVolatility(TradeItem) {
    try {
        let sql = `SELECT TradeItem,
            SUM(CASE WHEN Suggestion = 'Strong Buy' THEN 1 ELSE 0 END) AS StrongBuy, 
            SUM(CASE WHEN Suggestion = 'Buy' THEN 1 ELSE 0 END) AS Buy,
            SUM(CASE WHEN Suggestion = 'Neutral' THEN 1 ELSE 0 END) AS Neutral,
            SUM(CASE WHEN Suggestion = 'Sell' THEN 1 ELSE 0 END) AS Sell,
            SUM(CASE WHEN Suggestion = 'Strong Sell' THEN 1 ELSE 0 END) AS StrongSell,
            (SUM(CASE WHEN Suggestion = 'Strong Buy' THEN 3 ELSE 0 END) + SUM(CASE WHEN Suggestion = 'Buy' THEN 1 ELSE 0 END)) - (SUM(CASE WHEN Suggestion = 'Sell' THEN 1 ELSE 0 END) + SUM(CASE WHEN Suggestion = 'Strong Sell' THEN 3 ELSE 0 END)) AS Volatility
            FROM (
                SELECT * FROM scrapeddata
                WHERE TradeItem = ${TradeItem}
                ORDER BY DateTime DESC
                LIMIT 10
            ) AS SUBQUERY;`
        
        return runAsyncSQLQuery(sql)
        } catch(err) {
            throw err;
        }
    }

function getRecommendations(TradeItem, numberOfRecommendations=5) {
    try {
        let sql = `SELECT * FROM scrapeddata WHERE TradeItem = '${TradeItem}' ORDER BY DateTime DESC LIMIT ${numberOfRecommendations};`;
        return runAsyncSQLQuery(sql);
    } catch(err) {
        throw err;
    }
    }

function createNewTradeHistoryRecord(TradeItem, OpenPrice, Position) {
    try {
        let datetime = getCurrentTimeInSQLFormat();
        let sql = `INSERT INTO tradehistory (TradeItem, OpenPrice, Position, OpenedAt) VALUES ('${TradeItem}', ${OpenPrice}, '${Position}', '${datetime}');`
        return runAsyncSQLQuery(sql);
    } catch(err) {
        throw err;
    }
    }

function updateTradeHistoryRecord(TradeItem, openPrice, ClosePrice, Result) {
    try {
        let datetime = getCurrentTimeInSQLFormat();
        let selectSQL = `
        SELECT idtradeHistory FROM tradehistory 
        WHERE TradeItem = '${TradeItem}' AND OpenPrice = ${openPrice}
        ORDER BY OpenedAt DESC
        LIMIT 1`

        let updateSQL = `
        UPDATE tradehistory 
        SET ClosePrice = ${ClosePrice}, ClosedAt = '${datetime}', Result = ${Result}
        WHERE idtradeHistory =
        `

        return runAsyncSQLQuery(selectSQL).then((result) =>
        runAsyncSQLQuery(updateSQL + result[0].idtradeHistory))
    } catch(err) {
        throw err;
    }
}

function evaluateThenTrade(tradingBot) {
    try {
        getRecommendations(tradingBot._TradeItem).then((recommendations) => 
        tradingBot.evaluateConditions(recommendations))
    } catch(err) {
        throw err;
    }
}

function allBotsEvaluateThenTrade(tradingBotsArray) {
    try {
        for(let i=0; i<tradingBotsArray.length; i++) {
            evaluateThenTrade(tradingBotsArray[i])
        }
    } catch(err) {
        throw err;
    }
}

function setFundsForTradingBots(tradingBotsArray) {
    try {
        for(let i=0; i<tradingBotsArray.length; i++) {
            tradingBotsArray[i].setMoney();
        }
    } catch(err) {
        throw err;
    }
}

module.exports.getCurrentTimeInSQLFormat = getCurrentTimeInSQLFormat
module.exports.runAsyncSQLQuery = runAsyncSQLQuery
module.exports.getListOfTradeItemsFromDatabase = getListOfTradeItemsFromDatabase
module.exports.calculateVolatility = calculateVolatility
module.exports.getRecommendations = getRecommendations
module.exports.createNewTradeHistoryRecord = createNewTradeHistoryRecord
module.exports.updateTradeHistoryRecord = updateTradeHistoryRecord
module.exports.setFundsForTradingBots = setFundsForTradingBots
module.exports.evaluateThenTrade = evaluateThenTrade
module.exports.allBotsEvaluateThenTrade = allBotsEvaluateThenTrade