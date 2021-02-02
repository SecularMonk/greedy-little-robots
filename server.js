const express = require('express');
const cors = require('cors');
const mysql = require('mysql')

const app = express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "investingdata"
});

con.connect(function(err) {
  if(err) throw err;
});

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

function getListOfTradeItems() {
  try {
      let sql = `SELECT DISTINCT TradeItem, Class from scrapeddata ORDER BY Class DESC;`
      return runAsyncSQLQuery(sql);
  } catch(err) {
      throw err;
  }
}

function getMostRecentEntriesForTradeItem(tradeItem, entries=5) {
  try {
      let sql = `SELECT TradeItem, Suggestion, DateTime from scrapeddata WHERE TradeItem = '${tradeItem}' ORDER BY DateTime DESC LIMIT ${entries};`
      return runAsyncSQLQuery(sql);
  } catch(err) {
      throw err;
  }
}

function getTradeItemDetails(tradeItem) {
  try {
      let sql = `SELECT Price, Suggestion, DateTime from scrapeddata WHERE TradeItem = '${tradeItem}' ORDER BY DateTime DESC;`
      return runAsyncSQLQuery(sql);
  } catch(err) {
      throw err;
  }
}

app.get('/api/tradeItems', cors(), (req, res) => {
  getListOfTradeItems().then((items) => 
  res.json(items))
});

app.get('/api/tradeItems/:tradeItem', cors(), (req, res) => {
  let tradeItem = req.params.tradeItem;
  getMostRecentEntriesForTradeItem(tradeItem).then((entries) => {
    res.json(entries);
  });
});

app.get('/api/chartDetails/', cors(), (req, res) => {
  getTradeItemDetails('DAX').then((items) => 
  res.json(items))
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);