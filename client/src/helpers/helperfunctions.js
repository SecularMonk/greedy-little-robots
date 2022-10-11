const mysql = require("mysql");
const TradingBot = require("./tradingbots").TradingBot;

const con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "password",
   database: "investingdata",
});

con.connect(function (err) {
   if (err) throw err;
});

function getCurrentTimeInSQLFormat() {
   try {
      let date = new Date();
      let datetime = date.toISOString().slice(0, 19).replace("T", " ");
      return datetime;
   } catch (err) {
      throw err;
   }
}

function runAsyncSQLQuery(sql) {
   try {
      return new Promise(function (resolve, reject) {
         con.query(sql, function (err, rows, fields) {
            if (err) {
               return reject(err);
            }
            resolve(rows);
         });
      });
   } catch (err) {
      throw err;
   }
}

/* Connects to the database to return all the distinct trade items */
function getListOftradeItemsFromDatabase() {
   try {
      let sql = `SELECT DISTINCT tradeItem, class from investing ORDER BY class DESC;`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

/* Looks at each trade item individually to see how volatile it is.
    Volatility is how many times the summary has changed in a given time. */
function calculateVolatility(tradeItem) {
   try {
      let sql = `SELECT tradeItem,
            SUM(CASE WHEN summary = 'Strong Buy' THEN 1 ELSE 0 END) AS StrongBuy, 
            SUM(CASE WHEN summary = 'Buy' THEN 1 ELSE 0 END) AS Buy,
            SUM(CASE WHEN summary = 'Neutral' THEN 1 ELSE 0 END) AS Neutral,
            SUM(CASE WHEN summary = 'Sell' THEN 1 ELSE 0 END) AS Sell,
            SUM(CASE WHEN summary = 'Strong Sell' THEN 1 ELSE 0 END) AS StrongSell,
            (SUM(CASE WHEN summary = 'Strong Buy' THEN 3 ELSE 0 END) + SUM(CASE WHEN summary = 'Buy' THEN 1 ELSE 0 END)) - (SUM(CASE WHEN summary = 'Sell' THEN 1 ELSE 0 END) + SUM(CASE WHEN summary = 'Strong Sell' THEN 3 ELSE 0 END)) AS Volatility
            FROM (
                SELECT * from investing
                WHERE tradeItem = ${tradeItem}
                ORDER BY dateTime DESC
                LIMIT 10
            ) AS SUBQUERY;`;

      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

function getRecommendations(tradeItem, numberOfRecommendations = 5) {
   try {
      let sql = `SELECT * from investing WHERE tradeItem = '${tradeItem}' ORDER BY dateTime DESC LIMIT ${numberOfRecommendations};`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

function createNewTradeHistoryRecord(tradeItem, Openprice, Position) {
   try {
      let datetime = getCurrentTimeInSQLFormat();
      let sql = `INSERT INTO tradehistory (tradeItem, Openprice, Position, OpenedAt) VALUES ('${tradeItem}', ${Openprice}, '${Position}', '${datetime}');`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

function updateTradeHistoryRecord(tradeItem, openprice, Closeprice, Result) {
   try {
      let datetime = getCurrentTimeInSQLFormat();
      let selectSQL = `
        SELECT idtradeHistory FROM tradehistory 
        WHERE tradeItem = '${tradeItem}' AND Openprice = ${openprice}
        ORDER BY OpenedAt DESC
        LIMIT 1`;

      let updateSQL = `
        UPDATE tradehistory 
        SET Closeprice = ${Closeprice}, ClosedAt = '${datetime}', Result = ${Result}
        WHERE idtradeHistory =
        `;

      return runAsyncSQLQuery(selectSQL).then((result) => runAsyncSQLQuery(updateSQL + result[0].idtradeHistory));
   } catch (err) {
      throw err;
   }
}

function evaluateThenTrade(tradingBot) {
   try {
      getRecommendations(tradingBot._tradeItem).then((recommendations) => tradingBot.evaluateConditions(recommendations));
   } catch (err) {
      throw err;
   }
}

function allBotsEvaluateThenTrade(tradingBotsArray) {
   try {
      for (let i = 0; i < tradingBotsArray.length; i++) {
         evaluateThenTrade(tradingBotsArray[i]);
      }
   } catch (err) {
      throw err;
   }
}

function setFundsForTradingBots(tradingBotsArray) {
   try {
      for (let i = 0; i < tradingBotsArray.length; i++) {
         tradingBotsArray[i].setMoney();
      }
   } catch (err) {
      throw err;
   }
}

module.exports.getCurrentTimeInSQLFormat = getCurrentTimeInSQLFormat;
module.exports.runAsyncSQLQuery = runAsyncSQLQuery;
module.exports.getListOftradeItemsFromDatabase = getListOftradeItemsFromDatabase;
module.exports.calculateVolatility = calculateVolatility;
module.exports.getRecommendations = getRecommendations;
module.exports.createNewTradeHistoryRecord = createNewTradeHistoryRecord;
module.exports.updateTradeHistoryRecord = updateTradeHistoryRecord;
module.exports.setFundsForTradingBots = setFundsForTradingBots;
module.exports.evaluateThenTrade = evaluateThenTrade;
module.exports.allBotsEvaluateThenTrade = allBotsEvaluateThenTrade;
