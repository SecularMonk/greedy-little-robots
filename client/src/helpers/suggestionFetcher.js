const axios = require("axios");
const mysql = require("mysql");

const con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: `[O4mSQwD*W2}28w,^"9Flb-9A5ysXJdr`,
   database: "investing.com",
});

con.connect(function (err) {
   if (err) throw err;
});

//Tab is the number required in the URL to receive recommendations for that instrument.
const instruments = [
   { instrumentName: "Forex", tabNumber: 1 },
   { instrumentName: "Index", tabNumber: 3 },
   { instrumentName: "Crypto", tabNumber: 4 },
];

getAllRecommendations({ instruments });

async function getAllRecommendations({ instruments = [] }) {
   try {
      for (let i = 0, n = instruments.length; i < n; i++) {
         const recommendations = await getRecommendation({ tab: instruments[i].tab });
         const parsedRecommendations = parseRecommendations({ recommendations, instrumentName: instruments[i].instrumentName });
         saveRecommendations({ parsedRecommendations });
      }
   } catch (error) {
      console.log(error);
   }
}

async function getRecommendation({ tab }) {
   try {
      let { data } = await axios.get(`https://www.investing.com/common/technical_summary/api.php?action=TSB_updateTab&tab=${tab}&timeframe=60`);
      return data.pairObjects;
   } catch (error) {
      throw error;
   }
}

function parseRecommendations({ recommendations = [], instrumentName = "" }) {
   try {
      const tempReccomendations = [];
      const keys = Object.keys(recommendations);
      for (let i = 0, n = keys.length; i < n; i++) {
         let price = recommendations[i].summaryLast.replace(/\,/g, "");
         price = parseFloat(a, 10);
         if (!a || isNaN(a)) continue;
         const thisResult = {
            tradeItem: recommendations[i]?.summaryName ?? "",
            price,
            summary: recommendations[i].technicalSummary,
            class: instrumentName,
         };
         tempReccomendations.push(thisResult);
      }
      return tempReccomendations;
   } catch (error) {
      throw error;
   }
}

async function saveRecommendations({ parsedRecommendations }) {
   try {
      let date = new Date();
      let datetime = date.toISOString().slice(0, 19).replace("T", " ");
      for (let i = 0; i < parseRecommendations.length; i++) {
         if (!parsedRecommendations[i].tradeItem || !parsedRecommendations[i].price || !parsedRecommendations[i].summary) continue;
         const query = `INSERT INTO technical data (tradeItem, price, summary, dateTime, class) VALUES ('${parsedRecommendations[i].tradeItem}', ${parsedRecommendations[i].price}, '${parsedRecommendations[i].summary}', '${datetime}', '${parsedRecommendations[i].class}');`;
         return con.query(query);
      }
   } catch (error) {
      throw error;
   }
}

module.exports.getRecommendation = getRecommendation;
module.exports.parseRecommendations = parseRecommendations;
module.exports.saveRecommendations = saveRecommendations;
