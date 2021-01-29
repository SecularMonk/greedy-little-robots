import React, { Component } from 'react';
import './tradeItems.css';

class TradeItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    }
    this.iterateKey = this.iterateKey.bind(this);
  }

  iterateKey() {
    this.state.key += 1
  }

  render() {
    return (
      <div>
        <h2>Trade items</h2>
        <ul>
        {this.props.tradeItems.map(tradeItems => 
          <li key={this.state.key}>{tradeItems.TradeItem} {tradeItems.Class}</li>
        )}
        {this.iterateKey()}
        </ul>
      </div>
    );
  }
}

export default TradeItems;