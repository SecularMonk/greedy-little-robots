import React, { Component } from 'react'

class SingleItemChartToggle extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            value: "default"
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
        this.props.updateSelection(event.target.value);
    }

    render() {
        return(
            <div>
                <label for="tradeItemToggle">
                    <select value={this.state.value} onChange={this.handleChange}>
                        {
                            this.props.toggleData ? 
                                this.props.toggleData.map(item => {
                                    return <option key={item.idscrapedData} value={item.tradeItem}>{item.tradeItem}</option>
                                }) : <option value="default">No data available</option>
                        }
                    </select>
                </label>
            </div>
        )
    }
}

export default SingleItemChartToggle;