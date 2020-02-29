import * as vscode from 'vscode';
import { FolderStructure } from '../types';

const getSelectedFolderStructure = (
  folderStructures: FolderStructure[],
  structureName = 'default',
) => {
  let { structure, customVariables } = folderStructures[0];
  if (structureName !== 'default') {
    const folderStructure = folderStructures.find(
      folderStructure => folderStructure.name === structureName,
    );
    if (!folderStructure) {
      vscode.window.showErrorMessage(
        'Could not find selected structure, please try again',
      );
      return null;
    }
    return { structure, customVariables };
  }
  if (!structure) {
    vscode.window.showErrorMessage(
      'Something went wrong, could not find folderstructure',
    );
    return undefined;
  }
  return { structure, customVariables };
};

export default getSelectedFolderStructure;
