import * as vscode from 'vscode';
import { FolderStructure } from '../types';

const removeTemplate = async () => {
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const folderStructures: FolderStructure[] | undefined = config.get(
    'structures',
  );
  if (!folderStructures) {
    vscode.window.showErrorMessage('No existing templates to delete');
    return;
  }
  const templateToDelete = await vscode.window.showQuickPick(
    folderStructures.map((structure) => structure.name),
  );
  if (templateToDelete) {
    await config.update(
      'structures',
      folderStructures.filter(
        (structure) => structure.name === templateToDelete,
      ),
    );
  }
};

export default removeTemplate;
