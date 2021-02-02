import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TradeItems from './components/tradeItems/tradeItems';
import TradeItem from './components/tradeItem/tradeItem'
import SingleTradeItemChart from './components/singleTradeItemChart/container/singleTradeItemChartContainer'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Express Starter</h1>
        </header>
        <TradeItems />
        <TradeItem />
        <SingleTradeItemChart />
      </div>
    );
  }
}

export default App;
