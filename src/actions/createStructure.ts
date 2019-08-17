import * as vscode from 'vscode';
import { getFileContentStringAndReplacePlaceholder, ensure } from '../util';
import {
  FolderStructureFile,
  FolderStructure,
  TemplateCollection,
} from '../types';

const createStructure = async (
  componentName: string,
  structure: FolderStructure['structure'] | undefined,
  resource?: vscode.Uri,
) => {
  const wsedit = new vscode.WorkspaceEdit();

  if (structure) {
    const config = vscode.workspace.getConfiguration('fastFolderStructure');
    const templates: TemplateCollection | undefined = config.get(
      'fileTemplates',
    );
    structure.forEach((file: FolderStructureFile) => {
      const newPath = vscode.Uri.file(
        `${(resource && resource.fsPath) ||
          'test'}/${componentName}/${file.fileName.replace(
          '<FFSName>',
          componentName,
        )}`,
      );
      wsedit.createFile(newPath, { ignoreIfExists: true });
      const template = templates && templates[file.template];

      wsedit.insert(
        newPath,
        new vscode.Position(0, 0),
        getFileContentStringAndReplacePlaceholder(
          template,
          '<FFSName>',
          componentName,
        ),
      );
    });
    vscode.workspace.applyEdit(wsedit);
    //vscode.window.activeTextEditor.hide();
  }
};

export default createStructure;
