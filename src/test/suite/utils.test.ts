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
    const variableName = "FTName";
    // Get all parts of a string enclosed in < >
    const regex = getReplaceRegexp(variableName);

    replacePlaceholder(`<FTName>`, regex, "dDDd").should.equal("dDDd");
    replacePlaceholder(`<FTName | uppercase>`, regex, "dDDd").should.equal(
      "DDDD"
    );
    replacePlaceholder(`<FTName % uppercase>`, regex, "dDDd").should.equal(
      "DDDD"
    );
    replacePlaceholder(`<FTName | lowercase>`, regex, "dDDd").should.equal(
      "dddd"
    );
    replacePlaceholder(`<FTName | capitalize>`, regex, "dDDd").should.equal(
      "DDDd"
    );
    replacePlaceholder(
      `<FTName | lowercasefirstchar>`,
      regex,
      "DDDd"
    ).should.equal("dDDd");
    replacePlaceholder(
      `<FTName | kebabcase>`,
      regex,
      "myNewComponent"
    ).should.equal("my-new-component");
    replacePlaceholder(
      `<FTName | snakecase>`,
      regex,
      "myNewComponent"
    ).should.equal("my_new_component");
    replacePlaceholder(
      `[FTName | lowercasefirstchar]`,
      regex,
      "DDDd"
    ).should.equal("dDDd");

    replacePlaceholder(
      `<FTName | camelcase>`,
      regex,
      'Start-_test   with* specialchars!"§$%&/89whoop'
    ).should.equal("startTestWithSpecialchars89whoop");
    replacePlaceholder(
      `<FTName | pascalcase>`,
      regex,
      'start-_test   with* specialchars!"§$%&/89whoop'
    ).should.equal("StartTestWithSpecialchars89whoop");

    replacePlaceholder(`<ASDF | capitalize>`, regex, "dDDd").should.equal(
      "<ASDF | capitalize>"
    );
    replacePlaceholder(`FTName`, regex, "dDDd").should.equal("FTName");
    replacePlaceholder(`<FTName`, regex, "dDDd").should.equal("<FTName");
    replacePlaceholder(`FTName>`, regex, "dDDd").should.equal("FTName>");
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
      ["FTName", "asddFf"],
      ["customVar1", "variablE"],
      ["customVar2", "variablE2"],
    ];
    const initialString =
      "<FTName | uppercase> <customVar1 | lowercase> <customVar2 | capitalize> <FTName | asdf> <FTNam>";
    replaceAllVariablesInString(initialString, replaceTuples).should.equal(
      "ASDDFF variable VariablE2 asddFf <FTNam>"
    );
  });
});
