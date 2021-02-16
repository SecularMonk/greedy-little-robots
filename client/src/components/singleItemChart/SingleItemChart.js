import React, { Component } from 'react';
import fetch from 'node-fetch';
/*import './SingleItemChart.css'*/

class SingleItemChart extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return(
            <div>
                    <ul>
                        {
                            this.props.tradeItemData.map(data => {
                                return <li>{data.TradeItem}</li>
                        })
                    }
                    </ul>
            </div>
        )
    }
};

export default SingleItemChart;