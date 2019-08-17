import * as vscode from 'vscode';
import createStructure from '../actions/createStructure';
import getStructure from '../lib/getSelectedFolderStructure';
import { FolderStructure } from '../types';

const CreateFolderStructure = async (resource: vscode.Uri) => {
  // The code you place here will be executed every time your command is executed
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const folderStructures: FolderStructure[] | undefined = config.get(
    'structures',
  );
  // Display a message box to the user
  let selectedStructureName = undefined;
  if (folderStructures && folderStructures.length > 1) {
    selectedStructureName = await vscode.window.showQuickPick(
      folderStructures.map((structure: FolderStructure) => structure.name),
    );
  }
  const selectedFolderStructure = getStructure(
    folderStructures || [],
    selectedStructureName,
  );
  const componentName = await vscode.window.showInputBox({
    placeHolder: 'Enter your Component Name',
  });
  if (folderStructures && componentName) {
    createStructure(componentName, selectedFolderStructure, resource);
  }
};
export default CreateFolderStructure;
