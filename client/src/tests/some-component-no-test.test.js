import { render, fireEvent, screen } from "@testing-library/react";
import React, { Component } from "react";
import SomeComponentForTestPilotNoTest from "../components/some-component-no-test";
import testPilot from "../testPilot/test-pilot";
testPilot.environment = "development-test";


// testPilot begin [ fifthTest ]
test("to have class .card", () => {
    const context = render(<SomeComponentForTestPilotNoTest />);
    const fields = context.container.querySelectorAll("[test-suite='fifthTest']");
    fields.forEach((field) => {
        expect(field.classList.contains('card')).toEqual(true);
    })
    
});
test("to not have class .card-header", () => {
    const context = render(<SomeComponentForTestPilotNoTest />);
    const fields = context.container.querySelectorAll("[test-suite='fifthTest']");
    fields.forEach((field) => {
        expect(field.classList.contains('card-header')).toEqual(false);
    })
    
});
// testPilot end 

// testPilot begin [ fourthTest ]
test("has attribute data-main-div with value set as true", () => {
    const context = render(<SomeComponentForTestPilotNoTest />);
    const fields = context.container.querySelectorAll("[test-suite='fourthTest']");
    fields.forEach((field) => {
        expect(field.getAttribute("data-main-div")).toEqual("true");
    })
    
});
// testPilot end 

// testPilot begin [ firstTest ]
test("innerText has same value as size state", () => {
    const context = render(<SomeComponentForTestPilotNoTest size="3" />);
    const fields = context.container.querySelectorAll("[test-suite='firstTest']");
    fields.forEach((field) => {
        expect(field.textContent).toMatch("3 houses");
    })
    
});
// testPilot end 

// testPilot begin [ secondTest ]
test("NOT render", () => {
    const context = render(<SomeComponentForTestPilotNoTest size="1" />);
    const fields = context.container.querySelectorAll("[test-suite='secondTest']");
    expect(fields.length === 0).toBeTruthy();
    
});
test("render", () => {
    const context = render(<SomeComponentForTestPilotNoTest size="2" />);
    const fields = context.container.querySelectorAll("[test-suite='secondTest']");
    expect(fields.length > 0).toBeTruthy();
    
});
// testPilot end 

// testPilot begin [ thirdTest ]
test("check mathPow() function value", () => {
    const context = render(<SomeComponentForTestPilotNoTest />);
    expect(testPilot.stateRecords["thirdTest"]).toEqual(9);
    
});
// testPilot end 

