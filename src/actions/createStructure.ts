import * as vscode from 'vscode';
import createFileOrDirectory from '../actions/createFileOrDirectory';
import { FolderStructure } from '../types';
import openAndSaveFile from './openAndSaveFile';

const createStructure = async (
  componentName: string,
  structure: FolderStructure['structure'] | undefined,
  resource?: vscode.Uri,
) => {
  if (structure) {
    const fileUris = await Promise.all(
      structure.map(createFileOrDirectory(componentName, resource?.fsPath)),
    );

    fileUris.forEach(openAndSaveFile);
  }
};

export default createStructure;
