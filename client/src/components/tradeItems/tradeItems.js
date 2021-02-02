import React, { Component } from 'react';
import './tradeItems.css';

class TradeItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      tradeItems: []
    }
    this.iterateKey = this.iterateKey.bind(this);
  }

  iterateKey() {
    this.setState({
      key: this.state.key + 1
    });
  }

  componentDidMount() {
    fetch('/api/tradeItems')
      .then(res => res.json())
      .then(tradeItems => this.setState({tradeItems}, () => console.log('Trade items fetched...', tradeItems)));
  }

  render() {
    return (
      <div>
        <h2>Trade items</h2>
        <ul>
        {this.state.tradeItems.map(tradeItems => 
          <li key={this.state.key}>{tradeItems.TradeItem} {tradeItems.Class}</li>
        )}
        {this.iterateKey}
        </ul>
      </div>
    );
  }
}

export default TradeItems;