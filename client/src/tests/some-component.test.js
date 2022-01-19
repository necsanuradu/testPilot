import { render, fireEvent, screen } from "@testing-library/react";
import React, { Component } from "react";
import SomeComponentForTestPilot from "../components/some-component";
import testPilot from "../testPilot/test-pilot";
testPilot.environment = "development-test";


// testPilot begin [ thirdTest ]
test("check it renders", () => {
    const context = render(<SomeComponentForTestPilot />);
    const fields = context.container.querySelectorAll("[test-suite='thirdTest']");
    expect(fields.length > 0).toBeTruthy();
    
});
// testPilot end 

// testPilot begin [ firstTest ]
test("check the component renders with text red", () => {
    const context = render(<SomeComponentForTestPilot color="red" starter="1" />);
    const fields = context.container.querySelectorAll("[test-suite='firstTest']");
    expect(fields.length > 0).toBeTruthy();
    fields.forEach((field) => {
        expect(field.textContent).toMatch("red");
        expect(field.getAttribute("class")).not.toMatch("card-title");
        expect(field).toBeInTheDocument();
    })
    
});
test("check the component is a div", () => {
    const context = render(<SomeComponentForTestPilot />);
    const fields = context.container.querySelectorAll("[test-suite='firstTest']");
    fields.forEach((field) => {
        expect(field.tagName.toLowerCase()).toEqual("div");
    })
    
});
// testPilot end 

// testPilot begin [ secondTest ]
test("state has changed on hover", () => {
    const context = render(<SomeComponentForTestPilot color="redx" />);
    expect(testPilot.stateRecords["secondTest"]).not.toEqual(1);
    
});
// testPilot end 

