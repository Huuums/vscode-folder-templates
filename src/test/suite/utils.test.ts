import * as chai from "chai";
chai.should();
import {
  replacePlaceholder,
  getReplaceRegexp,
  convertFileContentToString,
  replaceAllVariablesInString,
} from "../../lib/stringHelpers";

suite("lib/stringHelpersities suite", () => {
  test("replacePlaceholder to work with all Transformers", async () => {
    const variableName = "FFSName";
    // Get all parts of a string enclosed in < >
    const regex = getReplaceRegexp(variableName);

    replacePlaceholder(`<FFSName>`, regex, "dDDd").should.equal("dDDd");
    replacePlaceholder(`<FFSName | uppercase>`, regex, "dDDd").should.equal(
      "DDDD"
    );
    replacePlaceholder(`<FFSName % uppercase>`, regex, "dDDd").should.equal(
      "DDDD"
    );
    replacePlaceholder(`<FFSName | lowercase>`, regex, "dDDd").should.equal(
      "dddd"
    );
    replacePlaceholder(`<FFSName | capitalize>`, regex, "dDDd").should.equal(
      "DDDd"
    );
    replacePlaceholder(
      `<FFSName | lowercasefirstchar>`,
      regex,
      "DDDd"
    ).should.equal("dDDd");
    replacePlaceholder(
      `<FFSName | kebabcase>`,
      regex,
      "myNewComponent"
    ).should.equal("my-new-component");
    replacePlaceholder(
      `<FFSName | snakecase>`,
      regex,
      "myNewComponent"
    ).should.equal("my_new_component");
    replacePlaceholder(
      `[FFSName | lowercasefirstchar]`,
      regex,
      "DDDd"
    ).should.equal("dDDd");

    replacePlaceholder(
      `<FFSName | camelcase>`,
      regex,
      'Start-_test   with* specialchars!"§$%&/89whoop'
    ).should.equal("startTestWithSpecialchars89whoop");
    replacePlaceholder(
      `<FFSName | pascalcase>`,
      regex,
      'start-_test   with* specialchars!"§$%&/89whoop'
    ).should.equal("StartTestWithSpecialchars89whoop");

    replacePlaceholder(`<ASDF | capitalize>`, regex, "dDDd").should.equal(
      "<ASDF | capitalize>"
    );
    replacePlaceholder(`FFSName`, regex, "dDDd").should.equal("FFSName");
    replacePlaceholder(`<FFSName`, regex, "dDDd").should.equal("<FFSName");
    replacePlaceholder(`FFSName>`, regex, "dDDd").should.equal("FFSName>");
  });

  test("convertFileContent to return correct string", async () => {
    const array = ["asdf", "", "abcd", "        dddd"];
    const string = "asdf\n\nabcd\n        dddd";
    // Get all parts of a string enclosed in < >
    const targetString = `asdf

abcd
        dddd`;
    convertFileContentToString(array).should.equal(targetString);
    convertFileContentToString(string).should.equal(targetString);
    convertFileContentToString(undefined).should.equal("");
  });

  test("replaceAllVariablesInString to have replaced everything correctly", async () => {
    const replaceTuples = [
      ["FFSName", "asddFf"],
      ["customVar1", "variablE"],
      ["customVar2", "variablE2"],
    ];
    const initialString =
      "<FFSName | uppercase> <customVar1 | lowercase> <customVar2 | capitalize> <FFSName | asdf> <FFSNam>";
    replaceAllVariablesInString(initialString, replaceTuples).should.equal(
      "ASDDFF variable VariablE2 asddFf <FFSNam>"
    );
  });
});
