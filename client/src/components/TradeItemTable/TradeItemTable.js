import React, { Component, useState } from "react";
import "./TradeItemTable.css";

export default function TradeItemTable({ tradeItemData, toggleSort, sortOptions }) {
   console.log(`tradeItemData in TradeItemTable: ${JSON.stringify(tradeItemData)}`);

   function generateTable({ tradeItemData }) {
      try {
         return (
            // <table className={styles.tradeItemTable}>
            <table className="tradeItemTable">
               {generateTableHeader()}
               {generateTableContent({ tradeItemData })}
            </table>
         );
      } catch (error) {
         console.log("failed to generate table", error);
      }
   }

   const tableColumns = [{ item: "tradeItem", display: "Trade Item" }];

   function generateTableHeader() {
      try {
         return (
            <thead>
               <tr>
                  <th>
                     <button
                        className={
                           sortOptions.find((element) => {
                              return element.value === "tradeItem";
                           })?.order === "DESC"
                              ? "descending"
                              : "ascending"
                        }
                        onClick={() => toggleSort({ item: "tradeItem" })}
                     >
                        Trade Item
                     </button>
                  </th>
                  <th>
                     <button
                        className={
                           sortOptions.find((element) => {
                              return element.value === "price";
                           })?.order === "DESC"
                              ? "descending"
                              : "ascending"
                        }
                        onClick={() => toggleSort({ item: "price" })}
                     >
                        Price
                     </button>
                  </th>
                  <th>
                     <button
                        className={
                           sortOptions.find((element) => {
                              return element.value === "summary";
                           })?.order === "DESC"
                              ? "descending"
                              : "ascending"
                        }
                        onClick={() => toggleSort({ item: "summary" })}
                     >
                        Summary
                     </button>
                  </th>
                  <th>
                     <button
                        className={
                           sortOptions.find((element) => {
                              return element.value === "dateTime";
                           })?.order === "DESC"
                              ? "descending"
                              : "ascending"
                        }
                        onClick={() => toggleSort({ item: "dateTime" })}
                     >
                        Time
                     </button>
                  </th>
               </tr>
            </thead>
         );
      } catch (error) {
         console.log("failed to generate table header", error);
      }
   }

   function generateTableContent({ tradeItemData }) {
      try {
         if (tradeItemData && tradeItemData?.length > 0) {
            return tradeItemData.map((element) => {
               let dateTime = "";
               if (element.dateTime) {
                  dateTime = String(new Date(element.dateTime).toISOString().slice(0, 19));
                  dateTime = dateTime.replace("T", " ");
               }
               return (
                  <tbody>
                     <tr>
                        <td>{element?.tradeItem ?? ""}</td>
                        <td>{element?.price ?? 0}</td>
                        <td>{element?.summary ?? ""}</td>
                        <td>{dateTime}</td>
                     </tr>
                  </tbody>
               );
            });
         }
      } catch (error) {
         console.log("failed to render SingleItemChart", error);
      }
   }

   return generateTable({ tradeItemData });
}
