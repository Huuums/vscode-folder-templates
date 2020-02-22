import * as vscode from 'vscode';

const stringArray: any = [];

export default (variableNames: string[]) => {
  return variableNames.reduce(async (acc, variableName) => {
    const prevAcc = await acc;
    let placeHolder = `Enter Replace value to replace custom variable <${variableName}>`;
    if (variableName === 'FFSName') {
      placeHolder = `Enter the name of your new component`;
    }
    const inputValue = await vscode.window.showInputBox({
      placeHolder,
    });
    //always return a string
    return [...prevAcc, [variableName, inputValue || '']];
  }, Promise.resolve(stringArray));
};
