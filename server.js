const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "password",
   database: "investingdata",
});

con.connect(function (err) {
   if (err) throw err;
});

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

function getDistinctTradeItems() {
   try {
      let sql = `SELECT DISTINCT tradeItem from investing ORDER BY class DESC;`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

function getMostRecentEntriesForTradeItem(tradeItem, entries = 5) {
   try {
      let sql = `SELECT idinvesting, price, tradeItem, summary, dateTime from investing WHERE tradeItem = '${tradeItem}' ORDER BY dateTime DESC LIMIT ${entries};`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

function getTradeItemDetails(tradeItem) {
   try {
      let sql = `SELECT price, summary, dateTime from investing WHERE tradeItem = '${tradeItem}' ORDER BY dateTime DESC LIMIT 100;`;
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

app.get("/api/allTradeItems", cors(), (req, res) => {
   getDistinctTradeItems().then((items) => res.json(items));
});

app.get("/api/tradeItems/:tradeItem", cors(), (req, res) => {
   console.log(`req.params: ${JSON.stringify(req?.params)}`);
   let tradeItem = req.params.tradeItem;
   getMostRecentEntriesForTradeItem(tradeItem).then((entries) => {
      res.json(entries);
   });
});

app.get("/api/chartDetails/", cors(), (req, res) => {
   getTradeItemDetails("DAX").then((items) => res.json(items));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
