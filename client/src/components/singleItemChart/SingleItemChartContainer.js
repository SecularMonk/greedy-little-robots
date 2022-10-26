import axios from "axios";
import React, { Component, useEffect, useState } from "react";
/*import './SingleItemChart.css'*/
import SingleItemChart from "./SingleItemChart/SingleItemChart";
import SingleItemChartToggle from "./SingleItemChartToggle/SingleItemChartToggle";

export default function SingleItemChartContainer() {
   const [selection, updateSelection] = useState(null);
   const [tradeItemData, setTradeItemData] = useState([
      { idinvesting: 0, tradeItem: "GBP/USD" },
      { idinvesting: 1, tradeItem: "DAX" },
      { idinvesting: 2, tradeItem: "TEST" },
   ]);
   const [toggleData, setToggleData] = useState([
      { idinvesting: 0, tradeItem: "GBP/USD" },
      { idinvesting: 3, tradeItem: "BTC/EUR" },
      { idinvesting: 5, tradeItem: "SP500" },
   ]);

   useEffect(() => {
      getToggleData();
      getChartData({ tradeItem: selection });
   }, []);

   useEffect(() => {
      getChartData({ tradeItem: selection });
   }, [selection]);

   async function getChartData({ tradeItem }) {
      try {
         console.log(`getChartData`);
         const url = `http://localhost:5000/api/tradeItems/${tradeItem}`;
         console.log(`url: ${url}`);
         const response = await axios.post(url);
         console.log(`response before parsing: ${JSON.stringify(response)}`);
         // const tradeItemData = await response.json();
         // console.log(`tradeItemData: ${JSON.stringify(tradeItemData)}`);
         setTradeItemData(response.data);
      } catch (error) {
         console.log(error);
         // setTradeItemData([]);
      }
   }

   async function getToggleData() {
      const url = "http://localhost:5000/api/allTradeItems";
      const response = await axios.get(url);
      if (response) setToggleData(response.data);
   }

   return (
      <div>
         <SingleItemChartToggle toggleData={toggleData} updateSelection={updateSelection} />
         <SingleItemChart key={tradeItemData} tradeItemData={tradeItemData} />
      </div>
   );
}
