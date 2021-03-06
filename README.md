# testPilot
## Stack:  React + Express + Node.js

### Hi Suneet,
Based on our previous discussion when you accurately pointed out the test inheritance issue for evolving/reusable components, I wrote this small repo trying to bring the test suite logic inside the component and in doing so allowing for the tests to be inherited while changeable with the component within the context of their usage.
The tests are automatically written(development environment) inside the allocated test file named based on the component's file name.

### testPilot runs on two files:
- on the frontend - /client/src/testPilot/testPilot.js
- on the backend - /routes/testThisAppBackendPut.js

### all testPilot syntax icludes:
```
testPilot.testSuite = {render:[],property:[],attribute:[],react:[],state:[],props{}}
testPilot.render()
testPilot.recordState()
test-suite = "name your test"
```

### testPilot usage
1. Import testPilot
```
   import testPilot from "../testPilot/test-pilot"
   ```
2. Declare a test suite
```
   testPilot.testSuite={
      nameYourTest:{
          test: "check element gets rendered when props.age is 29",
          render: ["true"],
          props: {age: 29},
      },
   }
   ```
3. Trigger the testPilot execution by adding the <b>testPilot.render</b> on your return statement for your component
```
   return testPilot.render(
     <div> 
        your component's rendered html
        <div className="card" test-suite="firstTest">{props.age}</div>
     </div>
   )
   ```
4a.  Add the <b>test-suite</b> attribute to the html element that you run the test for.
```
    <div className="card" test-suite="firstTest">{props.age}</div>
```
4b. Or record the state of a variable or any other react object and hook it to a test
```
    testPilot.recordState(somFunction(someVariable), "secondTest");
    OR
    testPilot.recordState(props.color, "thirdTest");
    
    Where the tests could be:
    secondTest:{
       state: [9, "toEqual"]
    }
    
    thirdTest:{
       state: [false, "toBe", "not"]
    }
```
### To RUN this project
 * being inside the root directory of this project
   in the terminal run
  ```
      npm install
      npm start
  ```
 * navigate inside the client directory
   in the terminal run
  ```
      npm install
      npm start
  ```
  ### view it at
  ```
  http://localhost:3000/
  ```
  
  ### run testPilot in the context of another application
  Copy these two files to your new App<br />
    - on the frontend - /client/src/testPilot/testPilot.js<br />
    - on the backend - /routes/testThisAppBackendPut.js<br />
  
  Please make sure that the route <br /><b>/routes/testThisAppBackendPut.js</b><br />
  is declared and used in the backend <b>app.js<b> file adding these three lines.<br />
  ```
   var testAppPut = require("./routes/testThisAppBackendPut.js");
   const cors = require("cors");
   
   app.use(cors());
   app.use("/put", testAppPut);
   ```
   
  ### This repo comes with no tests, the test file will be automatically written once you run the project on your machine
  <b>Component in use as example at:</b>
  ```
  /client/src/components/some-component-no-test.js
  ```
  
  ### Component example with tests avaiable in the testSuite
  ```
import React, { useState, useEffect } from "react";
import testPilot from "../testPilot/test-pilot";

const instantiateTestsOrAnyOtherName = () => {
   testPilot.testSuite = {
    firstTest: {
      test: "innerText has same value as size state",
      property: ["textContent", "3 houses", "toMatch"],
      props: { size: "3" },
    },
    secondTest: [
      { test: "NOT render", render: ["false"], props: { size: 1 } },
      { test: "render", render: ["true"], props: { size: 2 } },
    ],
    thirdTest: {
      test: "check mathPow() function value",
      state: [9, "toEqual"],
    },
    fourthTest: {
      test: "has attribute data-main-div with value set as true",
      attribute: ["data-main-div", "true", "toEqual"],
    },
    fifthTest: [
      {
        test: "to have class .card",
        property: ["classList.contains('card')", true, "toEqual"],
      },
      {
        test: "to not have class .card-header",
        property: ["classList.contains('card-header')", false, "toEqual"],
      },
    ],
   };

   testPilot.recordState(mathPow(3, 2), "thirdTest");
};

let mathPow = (value, pow) => {
   return Math.pow(value, pow);
};

const SomeComponentForTestPilotNoTest = (props) => {
   instantiateTestsOrAnyOtherName();

   const [color, setColor] = useState(props.color);
   const [size, setSize] = useState(props.size);

   useEffect(() => {
    setSize(props.size);
   });

   return testPilot.render(
    <div>
      <div className="card mx-5 bg-light" test-suite="fifthTest">
        <div
          className="card-header"
          data-main-div="true"
          test-suite="fourthTest"
        >
          {color}
        </div>
        <div className="card-body" test-suite="firstTest">
          {size} houses
        </div>

        {size % 2 === 0 && (
          <div className="card-footer" test-suite="secondTest">
            component SomeComponentForTestPilot, <br /> not tested, tests will
            be generated by testPilot
          </div>
        )}
      </div>
    </div>
   );
};

export default SomeComponentForTestPilotNoTest;

  ```
  #### The previous component and testPilot will automatically generate exactly this test file for you
   you can find it newly made inside the <b>/client/src/tests/</b> directory
  ```
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


  ```
  ### Thank you,
