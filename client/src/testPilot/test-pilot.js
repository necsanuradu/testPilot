import { renderToString } from "react-dom/server";

const logTestNotFound = (testName, component) => {
  console.log(
    `test "${testName}" not found in the testSuite at: ${component["_source"].fileName}`
  );
};

var testPilot = {
  environment: "development",
  render: (component) => {
    testPilot.activeTests = [];
    if (testPilot.environment === "development") {
      testPilot.componentPath = component["_source"].fileName;
      const container = document.createElement("div");
      container.insertAdjacentHTML("afterbegin", renderToString(component));
      testPilot.prepareRenderTest(container, component);
      testPilot.prepareStateTest();
      testPilot.backendBuildTest();
    }
    return component;
  },
  prepareRenderTest: (container, component) => {
    container.querySelectorAll("[test-suite]").forEach((test) => {
      const testName = test.getAttribute("test-suite");
      if (testName in testPilot.testSuite) {
        let activeTest = testPilot.testSuite[testName];
        activeTest = Array.isArray(activeTest) ? activeTest : [activeTest];
        testPilot.setTest(testName, activeTest);
      } else logTestNotFound(testName, component);
    });
  },
  prepareStateTest: () => {
    for (const [key, value] of Object.entries(testPilot.testSuite)) {
      if ("state" in value && key in testPilot.stateRecords) {
        //testPilot.testSuite[key].state.unshift(testPilot.stateRecords[key]);
        let activeTest = Array.isArray(value) ? [value[0]] : [value];
        testPilot.setTest(key, activeTest);
      }
    }
  },
  checkDefaultItRenders: (testBody) => {
    if (Object.values(testBody).join("").replace(/none/g, "") === "") {
      testBody["expect6"] = ["true"];
      testBody["testTitle"] = "check it renders";
    }
    return testBody;
  },
  testOptions: ["property", "attribute", "react", "state", "props", "render"],
  setTest: (testName, testSuite) => {
    testPilot.activeTests.push({
      testGroups: testSuite.map((oneTest) => {
        let testBody = {
          testTitle: "test" in oneTest ? oneTest.test : "none",
        };
        testPilot.testOptions.forEach((value, index) => {
          testBody[`expect${index + 1}`] =
            value in oneTest ? oneTest[value] : "none";
        });
        testBody = testPilot.checkDefaultItRenders(testBody);
        return testBody;
      }),
      testName: testName,
    });
  },
  backendBuildTest: () => {
    return fetch("http://localhost:5000/put", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        testSuite: testPilot.activeTests,
        componentPath: testPilot.componentPath,
        testPath: testPilot.testPath,
      }),
    }).then((res) => res.text());
  },
  activeTests: [],
  stateRecords: {},
  testSuite: {},
  recordState: (state, test) => {
    testPilot.stateRecords[test] = state;
  },
  testPath: "/client/src/tests/",
};

export default testPilot;
