import React, { useState } from "react";

const SomeComponentForTestPilotNoTest = (props) => {
  const [color, setColor] = useState(props.color);

  return (
    <div>
      {color === "red" && (
        <div className="card bg-primary">
          <div className="card-header">{color}</div>
          <div className="card-body">{props.size}</div>
        </div>
      )}
    </div>
  );
};

export default SomeComponentForTestPilotNoTest;
