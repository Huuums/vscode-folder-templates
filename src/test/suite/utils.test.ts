import * as chai from 'chai';
chai.should();
import {
  replaceText,
  getReplaceRegexp,
  convertFileContentToString,
  replaceAllVariablesInString,
} from '../../util';

suite('Utilities suite', () => {
  test('replaceText to work with all Transformers', async () => {
    const variableName = 'FFSName';
    // Get all parts of a string enclosed in < >
    const regex = getReplaceRegexp(variableName);

    replaceText(`<FFSName>`, regex, 'dDDd').should.equal('dDDd');
    replaceText(`<FFSName | uppercase>`, regex, 'dDDd').should.equal('DDDD');
    replaceText(`<FFSName | lowercase>`, regex, 'dDDd').should.equal('dddd');
    replaceText(`<FFSName | capitalize>`, regex, 'dDDd').should.equal('DDDd');
    replaceText(`<FFSName | lowercasefirstchar>`, regex, 'DDDd').should.equal(
      'dDDd',
    );
    replaceText(`<FFSName | kebabcase>`, regex, 'myNewComponent').should.equal(
      'my-new-component',
    );
    replaceText(`<FFSName | snakecase>`, regex, 'myNewComponent').should.equal(
      'my_new_component',
    );
    replaceText(`[FFSName | lowercasefirstchar]`, regex, 'DDDd').should.equal(
      'dDDd',
    );

    replaceText(
      `<FFSName | camelcase>`,
      regex,
      'Start-_test   with* specialchars!"§$%&/89whoop',
    ).should.equal('startTestWithSpecialchars89whoop');
    replaceText(
      `<FFSName | pascalcase>`,
      regex,
      'start-_test   with* specialchars!"§$%&/89whoop',
    ).should.equal('StartTestWithSpecialchars89whoop');

    replaceText(`<ASDF | capitalize>`, regex, 'dDDd').should.equal(
      '<ASDF | capitalize>',
    );
    replaceText(`FFSName`, regex, 'dDDd').should.equal('FFSName');
    replaceText(`<FFSName`, regex, 'dDDd').should.equal('<FFSName');
    replaceText(`FFSName>`, regex, 'dDDd').should.equal('FFSName>');
  });

  test('convertFileContent to return correct string', async () => {
    const array = ['asdf', '', 'abcd', '        dddd'];
    const string = 'asdf\n\nabcd\n        dddd';
    // Get all parts of a string enclosed in < >
    const targetString = `asdf

abcd
        dddd`;
    convertFileContentToString(array).should.equal(targetString);
    convertFileContentToString(string).should.equal(targetString);
    convertFileContentToString(undefined).should.equal('');
  });

  test('replaceAllVariablesInString to have replaced everything correctly', async () => {
    const replaceTuples = [
      ['FFSName', 'asddFf'],
      ['customVar1', 'variablE'],
      ['customVar2', 'variablE2'],
    ];
    const initialString =
      '<FFSName | uppercase> <customVar1 | lowercase> <customVar2 | capitalize> <FFSName | asdf> <FFSNam>';
    replaceAllVariablesInString(initialString, replaceTuples).should.equal(
      'ASDDFF variable VariablE2 asddFf <FFSNam>',
    );
  });
});
