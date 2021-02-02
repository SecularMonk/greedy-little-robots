import React, { Component } from 'react'
import './singleTradeItemChart.css'

class singleTradeItemChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            key: 0,
            tradeItemData: []
        }
        this.iterateKey = this.iterateKey.bind(this);
    }

    iterateKey() {
        this.setState({
          key: this.state.key + 1
        });
      }

    componentDidMount() {
        fetch('/api/chartDetails/')
        .then(res => res.json())
        .then(tradeItemData => this.setState({tradeItemData}))
    }

    render() {
        return(
            <div>
                {this.state.tradeItemData.map(entry => {
                    return <li key={this.state.key}>{entry.Price} {entry.Suggestion} {entry.DateTime}</li>
                })}
            </div>
        )
    }
}

export default singleTradeItemChart;