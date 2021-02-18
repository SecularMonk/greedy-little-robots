import React, { Component } from 'react';
/*import './SingleItemChart.css'*/
import SingleItemChart from './SingleItemChart/SingleItemChart'
import SingleItemChartToggle from './SingleItemChartToggle/SingleItemChartToggle';

class SingleItemChartContainer extends Component {
    constructor() {
        super()
        this.state = {
            tradeItemData: [
                {idscrapedData: 0, TradeItem: 'GBP/USD'},
                {idscrapedData: 1, TradeItem: 'DAX'}
            ],
            toggleData: [
                {idscrapedData: 0, TradeItem: 'GBP/USD'},
                {idscrapedData: 3, TradeItem: 'BTC/EUR'},
                {idscrapedData: 5, TradeItem: 'SP500'}
            ],
            selection: ''
        }
        this.updateSelection = this.updateSelection.bind(this);
    }

    getChartData() {
        fetch('/api/tradeItems')
        .then((jsonResponse) => this.setState({tradeItemData: jsonResponse}))
    }

    getToggleData() {
        fetch('/api/tradeItems')
        .then((jsonResponse) => this.setState({toggleData: jsonResponse}))
    }

    updateSelection(value) {
        this.setState({
            selection: value
        })
    }

    render() {
        return(
            <div>
                <SingleItemChartToggle toggleData={this.state.toggleData} updateSelection={this.updateSelection}/>
                <SingleItemChart tradeItemData={this.state.tradeItemData} />
            </div>
        )
    }
}

export default SingleItemChartContainer;