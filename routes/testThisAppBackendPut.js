var express = require("express");
var router = express.Router();
var fs = require("fs");

var toImport = [
  'import { render, fireEvent, screen } from "@testing-library/react";',
  'import React, { Component } from "react";',
];

const beginMarkup = "// testPilot begin";
const endMarkup = "// testPilot end";
var componentName;

const getTestFullPath = (testPath, componentPath) => {
  return (
    process.cwd() +
    "/" +
    testPath.trim("/") +
    "/" +
    componentPath.split("/").pop().replace(/\.js$/, "") +
    ".test.js"
  )
    .toString()
    .replace(/[\/]{2}/g, "/");
};

const writeTestFileContent = (testPath, testContent) => {
  fs.writeFile(testPath, testContent, function (err) {
    if (err) throw err;
  });
};

const readTestFileContent = (testPath, testSuite) => {
  fs.readFile(testPath, function (err, testFileContent) {
    if (err == null) {
      buildTestFileContent(testFileContent.toString(), testSuite, testPath);
    } else {
      throw err;
    }
  });
};

const checkImportedDependencies = (testFileContent) => {
  testFileContent = testFileContent
    .toString()
    .replace(/(\r\n|\r|\n)/g, "\n")
    .split("\n");

  toImport.forEach((toImportOne) => {
    testFileContent = testFileContent.filter((line) => {
      return line.includes(toImportOne.split('"')[1]) ? false : true;
    });
  });
  return toImport.join("\n") + "\n" + testFileContent.join("\n");
};

const clearTestPilotTests = (testFileContent) => {
  regex = new RegExp(
    `(${beginMarkup})((?!(${beginMarkup}|${endMarkup})).)+(${endMarkup})`,
    "gis"
  );
  testFileContent = testFileContent.replace(regex, "");
  return testFileContent;
};

const cleanLineBreaks = (testFileContent) => {
  while (
    testFileContent.match(/(\n){3}/g) !== null ||
    testFileContent.match(/\n \n/g) !== null
  )
    testFileContent = testFileContent
      .replace(/\n \n/g, "\n")
      .replace(/(\n){3}/g, "\n\n");
  return testFileContent;
};

const addTestPilotTests = (testFileContent, testSuite) => {
  let testScript = "\n";
  testSuite.forEach((testBlock) => {
    testScript += `${beginMarkup} [ ${testBlock.testName} ]\n${getTestBody(
      testBlock
    )}\n${endMarkup} \n\n`;
  });
  return cleanLineBreaks(testFileContent) + testScript;
};

getExpectFor = {
  Property: (expect) => {
    return `expect(field${
      expect[0] !== "" ? "." + expect[0] : ""
    })${getExpectFor.deny(expect)}.${getExpectFor.match(expect)}(${
      isString(expect[1]) ? '"' + expect[1] + '"' : expect[1]
    });`;
  },
  Attribute: (expect) => {
    return `expect(field${
      expect[0] !== "" ? `.getAttribute("${expect[0]}")` : ""
    })${getExpectFor.deny(expect)}.${getExpectFor.match(expect)}(${
      isString(expect[1]) ? '"' + expect[1] + '"' : expect[1]
    });`;
  },
  React: (expect) => {
    expect.splice(0, 0, "", "");
    return `expect(field)${getExpectFor.deny(expect)}.${getExpectFor.match(
      expect
    )}();`;
  },
  match: (expect) => {
    return expect.length >= 3 && expect[2] !== "toEqual"
      ? expect[2].trim(".")
      : "toEqual";
  },
  deny: (expect) => {
    return expect.length >= 4 && expect[3] === "not" ? ".not" : "";
  },
};

const addRenderTest = (testBody, set) => {
  if ("expect6" in set && Array.isArray(set["expect6"])) {
    let manyAndSign = set["expect6"][0].length < 1 ? [0, ">"] : [];
    switch (set["expect6"][0]) {
      case "true":
        manyAndSign = [0, ">"];
        break;
      case "false":
        manyAndSign = [0, "==="];
        break;
      default:
        if (!isNaN(set["expect6"][0]))
          manyAndSign = [parseInt(set["expect6"][0]), "==="];
    }
    if (manyAndSign.length > 0)
      testBody.push(
        `expect(fields.length ${manyAndSign[1]} ${manyAndSign[0]}).toBeTruthy();`
      );
  }
  return testBody;
};

const testBodyRender = (testBody, testBlock, set, indent) => {
  testBody.push(
    `const fields = context.container.querySelectorAll("[test-suite='${testBlock.testName}']");`
  );
  testBody = addRenderTest(testBody, set);
  if (
    set["expect1"] !== "none" ||
    set["expect2"] !== "none" ||
    set["expect3"] !== "none"
  ) {
    testBody.push(`fields.forEach((field) => {`);
    ["Property", "Attribute", "React"].forEach((value, index) => {
      if (set[`expect${index + 1}`] !== "none")
        testBody.push(indent + getExpectFor[value](set[`expect${index + 1}`]));
    });
    testBody.push(`})`);
  }
  return testBody;
};

const isString = (value) => {
  return Object.prototype.toString.call(value) === "[object String]";
};

const testBodyState = (testBody, testBlock, set) => {
  let expect = set["expect4"];
  expect.splice(0, 0, "");
  testBody.push(
    `expect(testPilot.stateRecords["${testBlock.testName}"])${getExpectFor.deny(
      expect
    )}.${getExpectFor.match(expect)}(${
      isString(expect[1]) ? '"' + expect[1] + '"' : expect[1]
    });`
  );
  return testBody;
};

const addTestSuiteProps = (set) => {
  props = [];
  if ("expect5" in set && typeof set["expect5"] === "object") {
    for (const [key, value] of Object.entries(set["expect5"]))
      props.push(` ${key}="${value}"`);
  }
  return props.join("");
};

const getTestBody = (testBlock) => {
  let indent = "    ";
  return testBlock.testGroups
    .map((set) => {
      let testBody = [`test("${set.testTitle}", () => {`];
      testBody.push(
        `const context = render(<${componentName}${addTestSuiteProps(set)} />);`
      );

      if (set.expect4 === "none")
        testBody = testBodyRender(testBody, testBlock, set, indent);
      else testBody = testBodyState(testBody, testBlock, set, indent);
      testBody.push(`\n});`);
      return testBody.join("\n" + indent);
    })
    .join("\n");
};

const buildTestFileContent = (testFileContent, testSuite, testPath) => {
  testFileContent = checkImportedDependencies(testFileContent);
  testFileContent = clearTestPilotTests(testFileContent);
  testFileContent = addTestPilotTests(testFileContent, testSuite);
  writeTestFileContent(testPath, testFileContent); //+ "\n red green refactor"
};

toImportComponentCreateTest = (componentPath, testPath, testSuite) => {
  fs.readFile(componentPath, function (err, componentFileContent) {
    if (err == null) {
      componentName = componentFileContent
        .toString()
        .split("export default ")[1]
        .replace(/([,;]|\n)/g, " ")
        .split(" ")[0];
      let cPath = componentPath.split("components")[1].split(".js")[0];
      toImport.push(`import ${componentName} from "../components${cPath}";`);
      toImport.push(`import testPilot from "../testPilot/test-pilot";`);
      toImport.push(`testPilot.environment = "development-test";`);
      toImport = [...new Set(toImport)];
      createTest(testPath, testSuite);
    } else {
      throw err;
    }
  });
};

const createTest = (testPath, testSuite) => {
  try {
    if (fs.existsSync(testPath)) {
      readTestFileContent(testPath, testSuite);
    } else {
      buildTestFileContent("", testSuite, testPath);
    }
  } catch (err) {
    throw err;
  }
};

router.post("/", function (req, res, next) {
  const testPath = getTestFullPath(req.body.testPath, req.body.componentPath);
  const testSuite = req.body.testSuite;
  toImportComponentCreateTest(req.body.componentPath, testPath, testSuite);
});

module.exports = router;
