import * as vscode from 'vscode';
import { FolderStructure } from '../types';
import { ensure } from '../util';

const getSelectedFolderStructure = (
  folderStructures: FolderStructure[],
  structureName = 'default',
) => {
  let { structure, customVariables } = folderStructures[0];
  if (structureName !== 'default') {
    ({ structure, customVariables } = folderStructures.find(
      folderStructure => folderStructure.name === structureName,
    )!);
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
