import React, { useState } from "react";
import testPilot from "../testPilot/test-pilot";

testPilot.testSuite = {
  firstTest: [
    {
      test: "check the component renders with text red",
      property: ["textContent", "red", "toMatch"],
      attribute: ["class", "card-title", "toMatch", "not"],
      react: ["toBeInTheDocument"],
      props: { color: "red", starter: "1" },
      render: ["true"],
    },
    {
      test: "check the component is a div",
      property: ["tagName.toLowerCase()", "div"],
    },
  ],
  secondTest: {
    test: "state has changed on hover",
    state: ["red", "toEqual", "not"],
    props: { color: "redx" },
  },
  thirdTest: {},
};

const SomeComponentForTestPilot = (props) => {
  const [color, setColor] = useState(props.color);
  testPilot.recordState(color, "secondTest");

  return testPilot.render(
    <div className="card mx-5" test-suite="thirdTest">
      <div className="card bg-light" test-suite="firstTest">
        {color}
      </div>
      <div className="card-body">{props.size}</div>
    </div>
  );
};
SomeComponentForTestPilot.displayName = "MyComponent";
export default SomeComponentForTestPilot;
