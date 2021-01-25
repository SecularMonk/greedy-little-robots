const mysql = require('mysql')

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
    let date = new Date();   
    let datetime= date.toISOString().slice(0, 19).replace('T', ' '); 
    return datetime;
}

function runAsyncSQLQuery(sql) {
    return new Promise(function(resolve, reject) {
        con.query(sql, function(err, rows, fields) {
            if(err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

  /* Connects to the database to return all the distinct trade items */
function getListOfTradeItemsFromDatabase() {
    let sql = `SELECT DISTINCT TradeItem, Class from scrapeddata ORDER BY Class DESC;`
    return runAsyncSQLQuery(sql);
}

/* Looks at each trade item individually to see how volatile it is.
    Volatility is how many times the suggestion has changed in a given time. */
function calculateVolatility(TradeItem) {
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
    }

function getRecommendations(TradeItem, numberOfRecommendations=5) {
    let sql = `SELECT * FROM scrapeddata WHERE TradeItem = '${TradeItem}' ORDER BY DateTime DESC LIMIT ${numberOfRecommendations};`;
    return runAsyncSQLQuery(sql);
    }

function createNewTradeHistoryRecord(TradeItem, OpenPrice, Position) {
    let datetime = getCurrentTimeInSQLFormat();
    let sql = `INSERT INTO tradehistory (TradeItem, OpenPrice, Position, OpenedAt) VALUES ('${TradeItem}', ${OpenPrice}, '${Position}', '${datetime}');`
    return runAsyncSQLQuery(sql);
    }

function updateTradeHistoryRecord(TradeItem, openPrice, ClosePrice, Result) {
    let datetime = getCurrentTimeInSQLFormat();
    let selectSQL = `
    SELECT idTradeHistory FROM tradehistory 
    WHERE TradeItem = '${TradeItem}' AND OpenPrice = ${openPrice}
    ORDER BY OpenedAt DESC
    LIMIT 1`

    let updateSQL = `
    UPDATE tradehistory 
    SET ClosePrice = ${ClosePrice}, ClosedAt = '${datetime}', Result = ${Result}
    WHERE idTradeHistory =
    `

    return runAsyncSQLQuery(selectSQL).then((result) =>
    helpers.runAsyncSQLQuery(updateSQL + result[0].idtradeHistory))
}
/*

function test() {
    let selectSQL = `
    SELECT idtradeHistory FROM tradehistory 
    WHERE TradeItem = 'GBP/USD' AND OpenPrice = 12
    ORDER BY OpenedAt DESC
    LIMIT 1`

    let updateSQL = `
    UPDATE tradehistory 
    SET ClosePrice = 13, ClosedAt = '2020-12-06 15:39:33', Result = 1
    WHERE idTradeHistory =
    `
    helpers.runAsyncSQLQuery(selectSQL).then((result) => 
    helpers.runAsyncSQLQuery(updateSQL + result[0].idtradeHistory)
    )};

    */

module.exports.getCurrentTimeInSQLFormat = getCurrentTimeInSQLFormat
module.exports.runAsyncSQLQuery = runAsyncSQLQuery
module.exports.getListOfTradeItemsFromDatabase = getListOfTradeItemsFromDatabase
module.exports.calculateVolatility = calculateVolatility
module.exports.getRecommendations = getRecommendations
module.exports.createNewTradeHistoryRecord = createNewTradeHistoryRecord
module.exports.updateTradeHistoryRecord = updateTradeHistoryRecord