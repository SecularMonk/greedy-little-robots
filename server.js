const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

function getMostRecentEntriesForTradeItem({ tradeItem, body = {}, limit = 5 }) {
   try {
      let sql = `SELECT idinvesting, price, tradeItem, summary, dateTime from investing WHERE tradeItem = "${tradeItem}" `;
      const sortOptions = body?.sortOptions ?? [];
      console.log(`sortOptions: ${JSON.stringify(sortOptions)}`);
      let sortString = "ORDER BY ";
      if (sortOptions.length > 0) {
         let sortAdded = false;
         for (let i = 0, n = body.sortOptions.length; i < n; i++) {
            console.log(`sortOptions[i]: ${JSON.stringify(sortOptions[i])}`);
            const value = sortOptions[i]?.value;
            const order = sortOptions[i]?.order;
            console.log(`value: ${value}, order: ${order}`);
            if (!value || !order) continue;
            if (sortAdded) sortString += ",";
            sortString += `${value} ${order} `;
            sortAdded = true;
         }
      }
      if (sortString.length > 9) sql += sortString;
      if (limit) sql += `LIMIT ${limit} `;
      // ORDER BY dateTime DESC
      sql += ";";
      console.log(`sql: ${sql}`);
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

function getChartControls() {
   try {
      return {};
      return runAsyncSQLQuery(sql);
   } catch (err) {
      throw err;
   }
}

app.get("/api/allTradeItems", cors(), (req, res) => {
   getDistinctTradeItems().then((items) => res.json(items));
});

app.post("/api/tradeItems/:tradeItem", cors(), (req, res) => {
   console.log(`req.params: ${JSON.stringify(req?.params)}`);
   console.log(`req.query: ${JSON.stringify(req?.body)}`);
   const tradeItem = req?.params?.tradeItem;
   if (!tradeItem) res.json({});
   const body = req?.body ?? {};
   getMostRecentEntriesForTradeItem({ tradeItem, body }).then((entries) => {
      res.json(entries);
   });
});

app.get("/api/chartDetails/", cors(), (req, res) => {
   getTradeItemDetails("DAX").then((items) => res.json(items));
});

app.get("/api/controls/chart", cors(), (req, res) => {
   getTradeItemDetails("DAX").then((items) => res.json(items));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
