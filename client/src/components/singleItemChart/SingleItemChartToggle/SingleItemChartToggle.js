import React, { Component, useEffect, useState } from "react";

export default function SingleItemChartToggle({ toggleData, updateSelection }) {
   const [value, setValue] = useState("default");

   useEffect(() => {
      updateSelection(value);
   }, []);

   function handleChange(event) {
      setValue(event.target.value);
      console.log(`SingleItemChartToggle handleChange event.target.value: ${event.target.value}`);
      updateSelection(event.target.value);
   }

   return (
      <div>
         <label htmlFor="tradeItemToggle">
            <select value={value} onChange={handleChange}>
               {toggleData ? (
                  toggleData.map((item) => {
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
