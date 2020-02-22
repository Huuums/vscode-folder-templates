import * as vscode from 'vscode';
import createStructure from '../actions/createStructure';
import getStructure from '../lib/getSelectedFolderStructure';
import { FolderStructure } from '../types';
import getReplaceValueTuples from '../lib/getReplaceValueTuples';

const CreateFolderStructure = async (resource: vscode.Uri) => {
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
  if (folderStructures && replaceValueTuples) {
    createStructure(replaceValueTuples, files, resource);
  }
};
export default CreateFolderStructure;
