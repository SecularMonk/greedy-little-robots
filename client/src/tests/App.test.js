import React, { Component } from 'react'
import { render, screen } from '@testing-library/react'
import Enzyme, { shallow, mount } from 'enzyme'
import '@testing-library/jest-dom/extend-expect'
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

Enzyme.configure({ adapter: new Adapter() });

describe('App component', () => {
    test('renders App component', () => {
      const appElement = shallow(<App />)
      expect(appElement.exists()).toBe(true);
    })

});