import * as vscode from 'vscode';
import createFileOrDirectory from '../actions/createFileOrDirectory';
import { FolderStructure, FolderStructureFile } from '../types';
import openAndSaveFile from './openAndSaveFile';

const createStructure = async (
  replaceValues: string[][],
  structure: FolderStructureFile[] | undefined,
  resource?: vscode.Uri,
  omitParentDirectory = false,
) => {
  if (structure) {
    const wsedit = new vscode.WorkspaceEdit();
    const fileUris = await Promise.all(
      structure.map(
        createFileOrDirectory(
          replaceValues,
          resource?.fsPath,
          omitParentDirectory,
          wsedit,
        ),
      ),
    );

    await vscode.workspace.applyEdit(wsedit);
    await Promise.all(fileUris.map(openAndSaveFile));

    return 'done';
  }
};

export default createStructure;
