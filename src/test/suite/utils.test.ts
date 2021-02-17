import * as chai from "chai";
chai.should();
import {
  replacePlaceholder,
  getReplaceRegexp,
  convertFileContentToString,
  replaceAllVariablesInString,
} from "../../lib/stringHelpers";

suite("lib/stringHelper suite", () => {
  test("replacePlaceholder to work with all Transformers", async () => {
    const variableName = "FTName";
    // Get all parts of a string enclosed in < >
    const regex = getReplaceRegexp(variableName);

    replacePlaceholder(`<FTName>`, regex, "dDDd").should.equal("dDDd");

    replacePlaceholder(`<FTName | lowercase>`, regex, "dDDd").should.equal("dddd");

    replacePlaceholder(`<FTName | uppercase>`, regex, "dDDd").should.equal("DDDD");

    replacePlaceholder(`<FTName % uppercase>`, regex, "dDDd").should.equal("DDDD");

    replacePlaceholder(`<FTName | camelcase>`, regex, 'Start-_test   with* specialchars!"§$%&/89whoop').should.equal("startTestWithSpecialchars89whoop");

    replacePlaceholder(`<FTName | capitalcase>`, regex, "dDeeDda sde").should.equal("D Dee Dda Sde");

    replacePlaceholder(`<FTName | constantcase>`, regex, "dDeeDda sde").should.equal("D_DEE_DDA_SDE");

    replacePlaceholder(`<FTName | dotcase>`, regex, "dDeeDda sde").should.equal("d.dee.dda.sde");

    replacePlaceholder(`<FTName | headercase>`, regex, "dDeeDda sde").should.equal("D-Dee-Dda-Sde");

    replacePlaceholder(`<FTName | nocase>`, regex, "dDeeDda sde").should.equal("d dee dda sde");

    replacePlaceholder(`<FTName | paramcase>`, regex, "dDeeDda sde").should.equal("d-dee-dda-sde");

    replacePlaceholder(`<FTName | pascalcase>`, regex, 'start-_test   with* specialchars!"§$%&/89whoop').should.equal("StartTestWithSpecialchars89whoop");

    replacePlaceholder(`<FTName | pathcase>`, regex, 'dDeeDda sde').should.equal("d/dee/dda/sde");

    replacePlaceholder(`<FTName | sentencecase>`, regex, 'dDeeDda sde').should.equal("D dee dda sde");

    replacePlaceholder(`<FTName | snakecase>`, regex, "dDeeDda sde").should.equal("d_dee_dda_sde");

    replacePlaceholder(`<FTName | singular>`, regex, "Boxes").should.equal("Box");

    replacePlaceholder(`<FTName | plural>`, regex, "Box").should.equal("Boxes");

    replacePlaceholder(`<FTName | lowercasefirstchar>`, regex, "DDeeDda sde").should.equal("dDeeDda sde");

    replacePlaceholder(`<FTName | capitalize>`, regex, "dDeeDda sde").should.equal("DDeeDda sde");

    replacePlaceholder(`<FTName | kebabcase>`, regex, "dDeeDda sde").should.equal("d-dee-dda-sde");

    replacePlaceholder(`<FTName | snakecase?capitalize>`, regex, "dDeeDda sde").should.equal("D_dee_dda_sde");

    replacePlaceholder(`<ASDF | capitalize>`, regex, "dDDd").should.equal("<ASDF | capitalize>");

    replacePlaceholder(`FTName`, regex, "dDDd").should.equal("FTName");

    replacePlaceholder(`<FTName`, regex, "dDDd").should.equal("<FTName");

    replacePlaceholder(`FTName>`, regex, "dDDd").should.equal("FTName>");

    replacePlaceholder(`<FTNames>`, regex, "dDDd").should.equal("<FTNames>");
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
