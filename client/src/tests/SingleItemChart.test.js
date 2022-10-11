import React, { Children, Component } from "react";
import { render, screen } from "@testing-library/react";
import Enzyme, { shallow, mount } from "enzyme";
import "@testing-library/jest-dom/extend-expect";
import Adapter from "enzyme-adapter-react-16";
import SingleItemChartContainer from "../components/singleItemChart/SingleItemChartContainer";
import SingleItemChartToggle from "../components/singleItemChart/SingleItemChartToggle/SingleItemChartToggle";
import SingleItemChart from "../components/singleItemChart/SingleItemChart/SingleItemChart";

const fetch = require("node-fetch");

Enzyme.configure({ adapter: new Adapter() });

describe("trade item chart container", () => {
   test("renders", () => {
      const element = shallow(<SingleItemChartContainer />);
      expect(element.exists()).toBe(true);
   });
   test("renders chart as child component", () => {
      const element = shallow(<SingleItemChartContainer />);
      expect(element.containsMatchingElement(<SingleItemChart />)).toBe(true);
   });
   test("renders toggle as child component", () => {
      const element = shallow(<SingleItemChartContainer />);
      expect(element.containsMatchingElement(<SingleItemChartToggle />)).toBe(true);
   });

   describe("updateSelection function", () => {
      test("exists", () => {
         const element = shallow(<SingleItemChartContainer />);
         expect(typeof element.instance().updateSelection).toBe("function");
      });
      test("correctly updates component state", () => {
         const element = shallow(<SingleItemChartContainer />);
         const expectedValue = "Mozambique";
         element.instance().updateSelection(expectedValue);
         expect(element.state("selection")).toEqual(expectedValue);
      });
   });
});

describe("trade item chart toggle", () => {
   test("renders", () => {
      const element = shallow(<SingleItemChartToggle />);
      expect(element.exists()).toBe(true);
   });
   test("renders props passed to it 1", () => {
      const toggleData = [
         { idinvesting: 0, tradeItem: "GBP/USD" },
         { idinvesting: 3, tradeItem: "BTC/EUR" },
         { idinvesting: 5, tradeItem: "SP500" },
      ];
      const element = shallow(<SingleItemChartToggle toggleData={toggleData} />);
      expect(element.text()).toContain("GBP/USD");
      expect(element.text()).toContain("BTC/EUR");
      expect(element.text()).toContain("SP500");
   });

   test("renders props passed to it 2", () => {
      const toggleData = [
         { idinvesting: 0, tradeItem: "Mozambique" },
         { idinvesting: 3, tradeItem: "Zanzibar" },
         { idinvesting: 5, tradeItem: "Bolivia" },
      ];
      const element = shallow(<SingleItemChartToggle toggleData={toggleData} />);
      expect(element.text()).toContain("Mozambique");
      expect(element.text()).toContain("Zanzibar");
      expect(element.text()).toContain("Bolivia");
   });

   test("renders default if no props passed", () => {
      const element = shallow(<SingleItemChartToggle />);
      expect(element.state("value")).toEqual("default");
   });
});

describe("trade item chart", () => {
   test("renders", () => {
      const element = shallow(<SingleItemChart />);
      expect(element.exists()).toBe(true);
   });

   test("displays tradeitems passed as props", () => {
      let tradeItemArray = [
         { "idinvesting.com": 0, tradeItem: "DAX" },
         { "idinvesting.com": 1, tradeItem: "GBP/USD" },
      ];
      const element = shallow(<SingleItemChart tradeItemData={tradeItemArray} />);

      expect(element.text()).toContain("DAX");
      expect(element.text()).toContain("GBP/USD");
   });

   test("displays message if no tradeitems passed", () => {
      const element = shallow(<SingleItemChart />);
      expect(element.text()).toContain("No trade data fetched");
   });
});
