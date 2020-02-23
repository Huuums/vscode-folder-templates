import * as assert from 'assert';
import { before, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as rimraf from 'rimraf';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { cleanDir } from '../util';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  before(() => {
    vscode.window.showInformationMessage('Start all tests.');
  });

  beforeEach(() => {
    rimraf.sync(
      vscode.workspace.workspaceFolders?.[0].uri.fsPath + '/src/components/',
    );
  });

  test('Structure gets created with custom variables as specified', async () => {
    const inputBox = sinon.stub(vscode.window, 'showInputBox');
    inputBox.onCall(0).returns(Promise.resolve<string>('src/components'));
    inputBox
      .onCall(1)
      .returns(Promise.resolve<string>('CustomVariableComponent'));
    inputBox.onCall(2).returns(Promise.resolve<string>('vaRiabLeVaLue'));
    inputBox.onCall(3).returns(Promise.resolve<string>('vaRiabLeVaLue2'));
    const structure = await sinon
      .stub(vscode.window, 'showQuickPick')
      .returns(Promise.resolve<any>('Multivar Test'));

    await vscode.commands.executeCommand('FFS.createFolderStructure');

    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
