import React, { Component, useState } from "react";
import SomeComponentForTestPilotNoTest from "./some-component-no-test";

const MainComponent = (props) => {
  const [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      <h1>testPilot {count}</h1>
      <SomeComponentForTestPilotNoTest color="red" size={count} />
    </div>
  );
};
export default MainComponent;
