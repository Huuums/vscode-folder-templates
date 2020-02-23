import * as vscode from 'vscode';
import createStructure from '../actions/createStructure';
import getStructure from '../lib/getSelectedFolderStructure';
import { FolderStructure } from '../types';
import getReplaceValueTuples from '../lib/getReplaceValueTuples';

const CreateFolderStructure = async (resource: vscode.Uri | undefined) => {
  if (!resource && vscode.workspace.workspaceFolders) {
    // if command is triggered via command box and not via context menu let user enter path where component should be created
    let activeWorkspace = vscode.workspace.workspaceFolders[0].uri;
    if (vscode.workspace.workspaceFolders.length > 1) {
      activeWorkspace =
        (
          await vscode.window.showWorkspaceFolderPick({
            placeHolder:
              'Select Workspace in which you want to create the Structure',
          })
        )?.uri || activeWorkspace;
    }
    console.log(activeWorkspace);

    resource = vscode.Uri.parse(
      activeWorkspace +
        '/' +
        ((await vscode.window.showInputBox({
          placeHolder:
            'Enter Path where component should be created (relative to project root)',
        })) || ''),
    );
  }
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const folderStructures: FolderStructure[] | undefined = config.get(
    'structures',
  );
  let selectedStructureName = undefined;
  //If more than one possible structure is configured prompt user to select which one
  if (folderStructures && folderStructures.length > 1) {
    selectedStructureName = await vscode.window.showQuickPick(
      folderStructures.map((structure: FolderStructure) => structure.name),
    );
  }
  const selectedFolderStructure = getStructure(
    folderStructures || [],
    selectedStructureName,
  );
  if (!selectedFolderStructure) {
    return;
  }
  const { customVariables, structure: files } = selectedFolderStructure;
  //Get all userinputs for replacement of variables
  const replaceValueTuples = await getReplaceValueTuples([
    'FFSName',
    ...(customVariables || []),
  ]);
  console.log(replaceValueTuples);
  if (folderStructures && replaceValueTuples) {
    await createStructure(replaceValueTuples, files, resource);
  }
  return Promise.resolve('done');
};
export default CreateFolderStructure;
