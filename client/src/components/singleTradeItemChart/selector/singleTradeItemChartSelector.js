import React, { Component } from 'react'
import './singleTradeItemChartSelector.css'

class ItemSelector extends Component {
    constructor() {
        super()
        this.state = {
            tradeItems: []
        }
    }

    componentDidMount() {
        fetch('/api/tradeItems')
        .then(res => res.json())
        .then(tradeItems => this.setState({tradeItems}))
    }

    render() {
        return (
            <div>
                <select className="selector" id="tradeItemsSelector">
                    {this.state.tradeItems.map(item => {
                      return <option value={item.TradeItem}>{item.TradeItem}</option>
                    })}
                </select>
            </div>
        )
    }
}

export default ItemSelector