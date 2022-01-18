import React, { useState } from "react";
import SomeComponentForTestPilotNoTest from "./some-component-no-test";
import SomeComponentForTestPilot from "./some-component";

const MainComponent = (props) => {
  return (
    <div>
      <h1>testPilot</h1>
      <SomeComponentForTestPilotNoTest color={"red"} />
      <br />
      <SomeComponentForTestPilot color={"red"} />
    </div>
  );
};
export default MainComponent;
