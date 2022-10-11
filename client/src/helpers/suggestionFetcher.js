const axios = require("axios");
const mysql = require("mysql");

const con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "password",
   database: "investingdata",
});

con.connect(function (err) {
   if (err) throw err;
});

// Tab is the number required in the URL to receive recommendations for that instrument.
const instruments = [
   { instrumentName: "Forex", tabNumber: 1 },
   { instrumentName: "Index", tabNumber: 3 },
   { instrumentName: "Crypto", tabNumber: 4 },
];

// const instruments = [{ instrumentName: "Forex", tabNumber: 1 }];

getAllRecommendations({ instruments });

async function getAllRecommendations({ instruments = [] }) {
   try {
      for (let i = 0, n = instruments.length; i < n; i++) {
         const recommendations = await getRecommendation({ tab: instruments[i].tabNumber });
         // console.log(`recommendations result: ${JSON.stringify(recommendations)}`);
         const parsedRecommendations = parseRecommendations({ recommendations, instrumentName: instruments[i].instrumentName });
         console.log(`parsedRecommendations: ${JSON.stringify(parsedRecommendations)}`);
         console.log(`numParsedRecommendations: `, parseRecommendations.length);
         saveRecommendations({ parsedRecommendations });
      }
   } catch (error) {
      console.log(error);
   }
}

async function getRecommendation({ tab }) {
   try {
      console.log(`getRecommendation, params: ${tab}`);
      const url = `https://www.investing.com/common/technical_summary/api.php?action=TSB_updateTab&tab=${tab}&timeframe=60`;
      console.log(`url: ${url}`);
      const queryResult = await axios.get(url);
      console.log(`result: ${Object.keys(queryResult)}`);
      return queryResult?.data?.pairObjects;
   } catch (error) {
      throw error;
   }
}

function parseRecommendations({ recommendations = [], instrumentName = "" }) {
   try {
      // console.log(`parsedRecommendations, params: recommendations: ${JSON.stringify(recommendations)}, instrumentName: ${instrumentName}`);
      console.log(`parsedRecommendations`);
      const tempRecommendations = [];
      // console.log(`entries: ${JSON.stringify(Object.entries(recommendations)[0][1])}`);
      // console.log(`entries: ${JSON.stringify(Object.entries(recommendations)[1][1])}`);
      // console.log(`entries: ${JSON.stringify(Object.entries(recommendations)[2][1])}`);

      const resultNames = Object.entries(recommendations).map((element) => {
         return element[1].summaryName;
      });
      console.log(`resultNames: ${resultNames}, numResults: ${resultNames.length}`);
      for (const [key, value] of Object.entries(recommendations)) {
         value.class = instrumentName;
         value.summaryLast = value.summaryLast.replace(",", "");
         tempRecommendations.push(value);
      }
      console.log(`parseRecommendations result: ${JSON.stringify(tempRecommendations)}`);
      return tempRecommendations;
   } catch (error) {
      throw error;
   }
}

async function saveRecommendations({ parsedRecommendations }) {
   try {
      console.log(`saveRecommendations`);
      let date = new Date();
      let datetime = date.toISOString().slice(0, 19).replace("T", " ");
      for (let i = 0, n = parsedRecommendations.length; i < n; i++) {
         // if (!parsedRecommendations[i]?.tradeItem || !parsedRecommendations[i]?.price || !parsedRecommendations[i]?.summary) continue;
         const query = `INSERT INTO investing (tradeItem, price, summaryChange, summaryChangePercent, summary, dateTime, class, maBuy, maSell, tiBuy, tiSell) VALUES ('${parsedRecommendations[i].summaryName}', ${parsedRecommendations[i].summaryLast}, ${parsedRecommendations[i].summaryChange}, ${parsedRecommendations[i].summaryChangePercent}, '${parsedRecommendations[i].technicalSummary}', '${datetime}', '${parsedRecommendations[i].class}', ${parsedRecommendations[i].maBuy}, ${parsedRecommendations[i].maSell}, ${parsedRecommendations[i].tiBuy}, ${parsedRecommendations[i].tiSell});`;
         console.log(`query: ${query}`);
         con.query(query);
      }
   } catch (error) {
      throw error;
   }
}

module.exports.getRecommendation = getRecommendation;
module.exports.parseRecommendations = parseRecommendations;
module.exports.saveRecommendations = saveRecommendations;
