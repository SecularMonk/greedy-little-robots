import React, { Component } from "react";
import Dygraph from "dygraphs";
/*import './SingleItemChart.css'*/

export default function SingleItemChart({ tradeItemData }) {
   function renderChart() {
      try {
         console.log(`singleItemChart, tradeItemData: ${JSON.stringify(tradeItemData)}`);
         if (tradeItemData && tradeItemData?.length !== 0) {
            return tradeItemData.map((data) => {
               return (
                  <li key={data.idinvesting}>
                     <h2>{data.tradeItem}</h2>
                     <h3>{data.summary}</h3>
                     <h3>{data.summaryLast}</h3>
                     <h3>{data.price}</h3>
                     <h4>{data.dateTime}</h4>
                  </li>
               );
            });
         }
         return <li>No trade data fetched</li>;
      } catch (error) {
         console.log("failed to render SingleItemChart", error);
      }
   }

   return <ul>{renderChart()}</ul>;
}
