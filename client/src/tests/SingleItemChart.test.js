import React, { Children, Component } from 'react'
import { render, screen } from '@testing-library/react'
import Enzyme, { shallow, mount } from 'enzyme'
import '@testing-library/jest-dom/extend-expect'
import Adapter from 'enzyme-adapter-react-16';
import SingleItemChart from '../components/singleItemChart/SingleItemChart';
import SingleItemChartContainer from '../components/singleItemChart/SingleItemChartContainer'

const fetch = require('node-fetch')

Enzyme.configure({ adapter: new Adapter() });

describe('trade item chart', () => {
    test('it renders', () => {
        const element = shallow(<SingleItemChart />)
        expect(element.exists()).toBe(true);
    })

    test('it displays props', () => {
        let tradeItemArray = [
            {TradeItem: 'DAX'},
            {TradeItem: 'GBP/USD'}
        ]
        const element = shallow(<SingleItemChart tradeItemData={tradeItemArray}/>)

        expect(element.find(Children)).toHaveLength(3);
    })
});