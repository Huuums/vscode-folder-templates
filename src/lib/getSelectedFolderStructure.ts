import * as vscode from 'vscode';
import { FolderStructure } from '../types';

const getSelectedFolderStructure = (
  folderStructures: FolderStructure[] | undefined,
  structureName = 'default',
) => {
  let folderStructure = folderStructures?.[0];
  if (structureName !== 'default') {
    folderStructure = folderStructures?.find(
      (folderStructure) => folderStructure.name === structureName,
    );
    if (!folderStructure) {
      vscode.window.showErrorMessage(
        'Could not find selected structure, please try again',
      );
      return null;
    }
  }
  if (!folderStructure) {
    vscode.window.showErrorMessage(
      'Something went wrong, could not find folderstructure',
    );
    return undefined;
  }
  return folderStructure;
};

export default getSelectedFolderStructure;
