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

function getListOfTradeItemsFromDatabase() {
  try {
      let sql = `SELECT DISTINCT TradeItem, Class from scrapeddata ORDER BY Class DESC;`
      return runAsyncSQLQuery(sql);
  } catch(err) {
      throw err;
  }
}

app.get('/api/tradeItems', cors(), (req, res) => {
  
  getListOfTradeItemsFromDatabase().then((items) => 
  res.json(items))

  /*
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];
  res.json(customers);
  */
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);