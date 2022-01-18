import React, { useState } from "react";
import SomeComponentForTestPilotNoTest from "./some-component-no-test";
import SomeComponentForTestPilot from "./some-component";

const MainComponent = (props) => {
  return (
    <div>
      <h1>testPilot</h1>
      <SomeComponentForTestPilotNoTest color={"red"} size="3" />
      <br />
      <SomeComponentForTestPilot color={"red"} size="8" />
    </div>
  );
};
export default MainComponent;
