import { render, fireEvent, screen } from "@testing-library/react";
import React, { Component } from "react";
import SomeComponentForTestPilotNoTest from "../components/some-component-no-test";
import testPilot from "../testPilot/test-pilot";
testPilot.environment = "development-test";


// testPilot begin [ xTest ]
test("none", () => {
    const context = render(<SomeComponentForTestPilotNoTest />);
    const fields = context.container.querySelectorAll("[test-suite='xTest']");
    expect(fields.length > 0).toBeTruthy();
    
});
// testPilot end 

