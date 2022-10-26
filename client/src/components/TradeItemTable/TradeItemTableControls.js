import React, { Component } from "react";

export default function TradeItemTableControls({ state }) {
   return (
      <div>
         <label htmlFor="tradeItemToggle">
            <select value={this.state.value} onChange={this.handleChange}>
               {this.props.toggleData ? (
                  this.props.toggleData.map((item) => {
                     return (
                        <option key={item.idinvesting} value={item.tradeItem}>
                           {item.tradeItem}
                        </option>
                     );
                  })
               ) : (
                  <option value="default">No data available</option>
               )}
            </select>
         </label>
      </div>
   );
}
