import React, { Component } from "react";
import fetch from "node-fetch";
/*import './SingleItemChart.css'*/

class SingleItemChart extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <ul>
               {this.props.tradeItemData ? (
                  this.props.tradeItemData.map((data) => {
                     return (
                        <li key={data.idinvesting}>
                           <h2>{data.tradeItem}</h2>
                           <h3>{data.summary}</h3>
                           <h3>{data.summaryLast}</h3>
                           <h3>{data.price}</h3>
                           <h4>{data.dateTime}</h4>
                        </li>
                     );
                  })
               ) : (
                  <li>No trade data fetched</li>
               )}
            </ul>
         </div>
      );
   }
}

export default SingleItemChart;
