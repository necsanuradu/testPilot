# testPilot
## stack:  React + Express + Node.js

### Hi Suneet,
Based on our previous discussion when you greatly pointed out the test inheritance issue for evolving/reusable components, I wrote this small repo trying to bring the test suite logic inside the component and in doing so allowing for the tests to be inherited while changeable with the component within the context  of their usage.<br />
The tests are automaticaly written(development environment) inside the alocated test file named based on the name of the component's file name.

### testPilot runs on two files:
- on the frontend - /client/src/testPilot/testPilot.js
- on the backend - /routes/testThisAppBackendPut.js

### all testPilot syntax icludes:
```
testPilot.testSuite = {render:[],property:[],attribute:[],react:[],state:[],props{}}
testPilot.render()
testPilot.recordState()
test-suite = "name of your test"
```

### testPilot usage
1. Import testPilot
```
   import testPilot from "../testPilot/test-pilot"
   ```
2. Declare a test suite
```
   testPilot.testSuite={
      firstTest:{
          render:["true"],
      },
   }
   ```
3. Trigger the testPilot execution by adding the <b>testPilot.render</b> on you return statement for you component
```
   return <b>testPilot.render</b>(
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
    
    WHere the tests could be:
    secondTest:{
       state:[9, "toEqual"]
    }
    
    thirdTest:{
       state:[false, "toBe", "not"]
    }
```
