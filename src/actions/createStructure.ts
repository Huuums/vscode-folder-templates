import * as vscode from 'vscode';
import createFileOrDirectory from '../actions/createFileOrDirectory';
import { FolderStructure, FolderStructureFile } from '../types';
import openAndSaveFile from './openAndSaveFile';

const createStructure = async (
  replaceValues: string[][],
  structure: FolderStructureFile[] | undefined,
  resource?: vscode.Uri,
) => {
  if (structure) {
    const wsedit = new vscode.WorkspaceEdit();
    const fileUris = await Promise.all(
      structure.map(
        createFileOrDirectory(replaceValues, resource?.fsPath, wsedit),
      ),
    );

    await vscode.workspace.applyEdit(wsedit);
    fileUris.forEach(openAndSaveFile);
  }
};

export default createStructure;
