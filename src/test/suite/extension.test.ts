/* tslint:disable:no-unused-expression */

import { before, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as rimraf from 'rimraf';
import * as chai from 'chai';
import * as fs from 'fs';
import { promisify } from 'util';
import chaifs from 'chai-fs';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
chai.use(chaifs);
chai.should();
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Fast Folder Structure Extension Suite', () => {
  const componentsPath =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath + '/src/components';
  const noDeletionPath =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath + '/src/donotdelete';
  const templateFolder =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath + '/src/templateFolder';
  const guideLineFolderPath =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath + '/guideline/';
  const inputBox = sinon.stub(vscode.window, 'showInputBox');
  const quickpick = sinon.stub(vscode.window, 'showQuickPick');

  before(() => {
    vscode.window.showInformationMessage('Start all tests.');
    rimraf.sync(componentsPath);
  });

  beforeEach(() => {
    sinon.reset();
  });

  test('FTName interpolation on filename and filecontent should work as expected', async () => {
    const path = `${componentsPath}/fTNameInterpolation`;
    //path to folder
    inputBox.onCall(0).resolves('src/components');

    //Structure choice
    quickpick.onCall(0).returns(Promise.resolve<any>('FTName Interpolation'));

    //FTName
    inputBox.onCall(1).resolves('fTNameInterpolation');

    await vscode.commands.executeCommand('FT.createFolderStructure');
    quickpick.should.have.been.calledOnce;
    inputBox.should.have.been.calledTwice;

    path.should.be.a
      .directory()
      .and.equal(`${guideLineFolderPath}/FTName Interpolation`);

    // have to do this for some reason so the content is there

    `${path}/FTNameInterpolation.txt`.should.be.a
      .file()
      .and.equal(
        `${guideLineFolderPath}/FTName Interpolation/FTNameInterpolation.txt`
      );
  });

  test('Custom variable interpolation should work on filename and filecontent', async () => {
    const path = `${componentsPath}/CustomVariableInterpolation`;
    inputBox.onCall(0).resolves('src/components');
    inputBox.onCall(1).resolves('CustomVariableInterpolation');
    inputBox.onCall(2).resolves('variable1');
    inputBox.onCall(3).resolves('variable2');
    quickpick
      .onCall(0)
      .returns(Promise.resolve<any>('Custom Variable Interpolation'));

    await vscode.commands.executeCommand('FT.createFolderStructure');
    //path, ftname and once for every custom variable
    inputBox.should.have.been.callCount(4);
    quickpick.should.have.been.calledOnce;
    path.should.be.a
      .directory()
      .and.equal(`${guideLineFolderPath}/CustomVariableInterpolation`);

    // have to do this for some reason so the content is there

    `${path}/CustomVariableInterpolation.jsx`.should.be.a
      .file()
      .and.equal(
        `${guideLineFolderPath}/CustomVariableInterpolation/CustomVariableInterpolation.jsx`
      );
  });

  test('EmptyDirectory template should create as many empty directories as specified', async () => {
    const path = `${componentsPath}/EmptyDirectoryTest`;
    inputBox.onCall(0).resolves('src/components');
    inputBox.onCall(1).resolves('EmptyDirectoryTest');
    quickpick.onCall(0).returns(Promise.resolve<any>('Empty Directory Test'));

    await vscode.commands.executeCommand('FT.createFolderStructure');
    //path, ftname and once for every custom variable
    inputBox.should.have.been.callCount(2);
    quickpick.should.have.been.calledOnce;
    path.should.be.a
      .directory()
      .and.deep.equal(`${guideLineFolderPath}/EmptyDirectoryTest`);
  });

  test('should not create existing files', async () => {
    const path = `${noDeletionPath}/nodeletiontest`;

    try {
      await unlink(path + '/newfile.js');
    } catch (e) {}
    path.should.be.a
      .directory()
      .with.contents(['existingfile2.js', 'existingfile.js']);
    inputBox.onCall(0).resolves('src/donotdelete');
    inputBox.onCall(1).resolves('nodeletiontest');
    quickpick.onCall(0).returns(Promise.resolve<any>('No Deletion Test'));
    const infoMessage = sinon.stub(vscode.window, 'showInformationMessage');
    await vscode.commands.executeCommand('FT.createFolderStructure');
    //path, ftname and once for every custom variable
    inputBox.should.have.been.callCount(2);
    quickpick.should.have.been.calledOnce;
    infoMessage.should.have.been.calledTwice;
    path.should.be.a
      .directory()
      .with.contents(['existingfile2.js', 'existingfile.js', 'newfile.js']);
    `${path}/newfile.js`.should.be.a.file().with.content('NODELETIONTEST');
    `${path}/existingfile.js`.should.be.a.file().and.empty;
  });
});
