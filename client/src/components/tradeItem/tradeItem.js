import React, { Component } from 'react';
import './tradeItem.css';

class TradeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeItem: [],
      key: 0
    }
    this.iterateKey = this.iterateKey.bind(this);
  }

  iterateKey() {
    this.setState({
      key: this.state.key + 1
    });
  }

  componentDidMount() {
    fetch('/api/tradeItems/:tradeItem')
      .then(res => res.json())
      .then(tradeItem => this.setState({tradeItem}, () => console.log('Trade items fetched...', tradeItem)));
  }

  render() {
    return (
      <div>
        <h2>DAX</h2>
        <ul>
        {this.state.tradeItem.map(tradeItem => 
          <li key={this.state.key}>{tradeItem.TradeItem} {tradeItem.Suggestion} {tradeItem.DateTime}</li>
        )}
        {this.iterateKey}
        </ul>
      </div>
    );
  }
}

export default TradeItem;