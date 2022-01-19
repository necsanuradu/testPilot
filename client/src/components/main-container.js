import React, { Component, useState } from "react";
import SomeComponentForTestPilotNoTest from "./some-component-no-test";
import SomeComponentForTestPilot from "./some-component";
//

const MainComponent = (props) => {
  const [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      <h1>testPilot {count}</h1>
      <SomeComponentForTestPilotNoTest color="red" size={count} />
      <br />
      <SomeComponentForTestPilot color="red" size="33" />
    </div>
  );
};
export default MainComponent;
