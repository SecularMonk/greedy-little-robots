import React, { Component } from 'react';
/*import './SingleItemChart.css'
import SingleItemChart from './SingleItemChart'*/

class SingleItemChartContainer extends Component {
    constructor() {
        super()
        this.state = {
            tradeItemData: [
                {TradeItem: 'GBP/USD'},
                {TradeItem: 'DAX'}
            ]
        }
    }

    getData() {
        fetch('/api/tradeItems')
        .then((jsonResponse) => this.setState({tradeItemData: jsonResponse}))
    }

    render() {
        return(
            <SingleItemChart tradeItemData={this.state.tradeItemData} />
        )
    }
}

export default SingleItemChartContainer;