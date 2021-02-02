import React, { Component } from 'react'
import ItemSelector from '../selector/singleTradeItemChartSelector'
import Chart from '../chart/singleTradeItemChart'
import './singleTradeItemChartContainer.css'

class singleTradeItemChartContainer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <ItemSelector />
                <Chart />
            </div>
        )
    }
}

export default singleTradeItemChartContainer;