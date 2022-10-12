import React, { Component } from "react";
/*import './SingleItemChart.css'*/
import SingleItemChart from "./SingleItemChart/SingleItemChart";
import SingleItemChartToggle from "./SingleItemChartToggle/SingleItemChartToggle";

class SingleItemChartContainer extends Component {
   constructor() {
      super();
      this.state = {
         tradeItemData: [
            { idinvesting: 0, tradeItem: "GBP/USD" },
            { idinvesting: 1, tradeItem: "DAX" },
            { idinvesting: 2, tradeItem: "TEST" },
         ],
         toggleData: [
            { idinvesting: 0, tradeItem: "GBP/USD" },
            { idinvesting: 3, tradeItem: "BTC/EUR" },
            { idinvesting: 5, tradeItem: "SP500" },
         ],
         selection: "",
      };
      this.updateSelection = this.updateSelection.bind(this);
   }

   componentDidMount() {
      this.getToggleData();
      this.getChartData();
   }

   async getChartData({ tradeItem }) {
      try {
         console.log(`getChartData`);
         const response = await fetch(`http://localhost:5000/api/tradeItems/${tradeItem}`);
         console.log(`response before parsing: ${JSON.stringify(response)}`);
         const tradeItemData = await response.json();
         console.log(`tradeItemData: ${JSON.stringify(tradeItemData)}`);
         this.setState({ tradeItemData });
      } catch (error) {
         console.log(error);
         this.setState({ tradeItemData: [] });
      }
   }

   async getToggleData() {
      const response = await fetch("http://localhost:5000/api/allTradeItems");
      const toggleData = await response.json();
      console.log(`toggleData: ${JSON.stringify(toggleData)}`);
      if (toggleData) this.setState({ toggleData });
   }

   updateSelection(value) {
      console.log(`SingleItemChartContainer handleChange value: ${value}`);
      this.setState({
         selection: value,
      });
      this.getChartData({ tradeItem: value });
   }

   render() {
      return (
         <div>
            <SingleItemChartToggle toggleData={this.state.toggleData} updateSelection={this.updateSelection} />
            <SingleItemChart key={this.state.tradeItemData} tradeItemData={this.state.tradeItemData} />
         </div>
      );
   }
}

export default SingleItemChartContainer;
