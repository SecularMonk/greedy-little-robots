import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TradeItems from './components/tradeItems';

class App extends Component {

  constructor() {
    super();
    this.state = {
      tradeItems: []
    }
  }

  componentDidMount() {
    fetch('/api/tradeItems')
      .then(res => res.json())
      .then(tradeItems => this.setState({tradeItems}, () => console.log('Trade items fetched...', tradeItems)));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Express Starter</h1>
        </header>
        <TradeItems tradeItems={this.state.tradeItems}/>
      </div>
    );
  }
}

export default App;
