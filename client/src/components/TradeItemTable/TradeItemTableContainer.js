import axios from "axios";
import React, { Component, useEffect, useState } from "react";
// import "./TradeItemTable.css";
import TradeItemTable from "./TradeItemTable";

export default function TradeItemTableContainer() {
   const [tradeItemData, setTradeItemData] = useState([{ tradeItem: "test", price: 1, summary: "buy" }]);
   // const [ sortOptions, setSortOptions ] = useState({ tradeItem: "asc", price: "none", summary: "none" });
   const [sortOptions, setSortOptions] = useState([{ value: "dateTime", order: "DESC" }]);
   const [refreshData, setRefreshData] = useState(false);

   useEffect(() => {
      getChartData({ tradeItem: "NVIDIA" });
      console.log(`tradeItemData in useEffect: ${JSON.stringify(tradeItemData)}`);
   }, [refreshData]);

   async function getChartData({ tradeItem = "NVIDIA" }) {
      try {
         console.log(`getChartData`);
         const url = `http://localhost:5000/api/tradeItems/${tradeItem}`;
         const body = { sortOptions };
         const response = await axios.post(url, body);
         setTradeItemData(response.data);
      } catch (error) {
         console.log(error);
      }
   }

   //Handles changes to the selected sort fields in the table.
   function toggleSort({ item = "" }) {
      const newSortOptions = sortOptions;
      const acceptedFields = ["tradeItem", "price", "dateTime", "summary"];
      console.log("toggleSort, item: ", item);
      console.log(`toggleSort, initialState: ${JSON.stringify(newSortOptions)}`);
      const matchingItemIndex = newSortOptions.findIndex((element) => {
         return element.value === item;
      });
      console.log("matchingItemIndex: ", matchingItemIndex);

      if (matchingItemIndex === -1 && !acceptedFields.includes(item)) return;

      const matchingItem = newSortOptions[matchingItemIndex] ?? {};
      let existingState = matchingItem?.order ?? "none";
      let newState;
      if (existingState === "none") {
         newState = "DESC";
      } else {
         newState = matchingItem.order === "ASC" ? "DESC" : "ASC";
      }
      const newElement = { value: item, order: newState };

      if (matchingItemIndex !== -1) {
         newSortOptions.splice(matchingItemIndex, 1);
      }
      newSortOptions.unshift(newElement);

      console.log(`toggleSort, newState: ${JSON.stringify(sortOptions)}`);
      setSortOptions(newSortOptions);
      setRefreshData(!refreshData);
      return newState;
   }

   return <TradeItemTable tradeItemData={tradeItemData} toggleSort={toggleSort} sortOptions={sortOptions} />;
   // return <TradeItemTable tradeItemData={tradeItemData} tradeItemSort={tradeItemSort} toggleTradeItemSort={toggleTradeItemSort} />;
}
