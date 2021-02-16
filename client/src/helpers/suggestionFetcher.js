const axios = require('axios');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "investingdata"
  });

con.connect(function(err) {
	if (err) throw err;
});

const getForexRecommendations = async () => {
	try {
		let { data } = await axios.get(
			'https://www.investing.com/common/technical_summary/api.php?action=TSB_updateTab&tab=1&timeframe=60'
		);
	
		return data.pairObjects;
	} catch (error) {
		throw error;
	}
};

const getIndicesRecommendations = async () => {
	try {
		let { data } = await axios.get(
			'https://www.investing.com/common/technical_summary/api.php?action=TSB_updateTab&tab=3&timeframe=60'
		);
	
		return data.pairObjects;
	} catch (error) {
		throw error;
	}
};

const getCryptoRecommendations = async () => {
	try {
		let { data } = await axios.get(
			'https://www.investing.com/common/technical_summary/api.php?action=TSB_updateTab&tab=4&timeframe=60'
		);
	
		return data.pairObjects;
	} catch (error) {
		throw error;
	}
};

async function storeReccomendationsLocally(recommendations, type) {
	try {
		let tempReccomendations = [];
		Object.keys(recommendations).forEach(function(item) {
			let a = recommendations[item].summaryLast.replace(/\,/g,'');
			a = parseFloat(a,10);
				tempReccomendations.push({
					TradeItem: recommendations[item].summaryName,
					Price: a,
					Suggestion: recommendations[item].technicalSummary,
					Class: type
			});
		});
		return tempReccomendations;
	} catch(error) {
		throw error;
	}
}

async function insertScrapedData (locallyStoredRecommendations) {
	try {
		 let date = new Date();   
		 let datetime= date.toISOString().slice(0, 19).replace('T', ' '); 
		 for (let i=0; i<locallyStoredRecommendations.length; i++) {
			 if (locallyStoredRecommendations[i].TradeItem == '' || locallyStoredRecommendations[i].Price == '' || locallyStoredRecommendations[i].Suggestion == '') {
				 continue;
			 }
		 var sql = `INSERT INTO scrapeddata (TradeItem, Price, Suggestion, DateTime, Class) VALUES ('${locallyStoredRecommendations[i].TradeItem}', ${locallyStoredRecommendations[i].Price}, '${locallyStoredRecommendations[i].Suggestion}', '${datetime}', '${locallyStoredRecommendations[i].Class}');`;
		 con.query(sql, function (err, result) {
		   if (err) throw err;
		 });
	   }
	   } catch(error) {
	   throw error;
   }
   }

function getTradeRecommendations() {

	getForexRecommendations().then(
		(result) => storeReccomendationsLocally(result, 'Forex')).then(
			(result) => insertScrapedData(result)
		)

	getIndicesRecommendations().then(
		(result) => storeReccomendationsLocally(result, 'Index')).then(
			(result) => insertScrapedData(result)
		)

	getCryptoRecommendations().then(
		(result) => storeReccomendationsLocally(result, 'Crypto')).then(
			(result) => insertScrapedData(result)
		)
}

getTradeRecommendations();
setInterval(() => {
	getTradeRecommendations();
}, 60000);

module.exports.getTradeRecommendations = getTradeRecommendations;
module.exports.storeReccomendationsLocally = storeReccomendationsLocally;
module.exports.insertScrapedData = insertScrapedData;