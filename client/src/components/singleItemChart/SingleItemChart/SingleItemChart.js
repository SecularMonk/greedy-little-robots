import React, { Component } from "react";
import fetch from "node-fetch";
/*import './SingleItemChart.css'*/

class SingleItemChart extends Component {
   constructor(props) {
      super(props);
   }

   renderChart() {
      try {
         if (this?.props?.tradeItemData && this.props.tradeItemData?.length !== 0) {
            return this.props.tradeItemData.map((data) => {
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

   render() {
      return (
         <div>
            <ul>{this.renderChart()}</ul>
         </div>
      );
   }
}

export default SingleItemChart;
