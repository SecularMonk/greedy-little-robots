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
                        this.props.tradeItemData ?
                            this.props.tradeItemData.map(data => {
                                return <li key={data.idscrapedData}>{data.tradeItem}</li>
                        }) : <li>No trade data fetched</li>
                    }
                    </ul>
            </div>
        )
    }
};

export default SingleItemChart;