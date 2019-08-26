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
    const fileUris = structure.map((file: FolderStructureFile) => {
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
      return file.template ? newPath : null;
    });
    await vscode.workspace.applyEdit(wsedit);
    fileUris.forEach(async (uri: vscode.Uri | null) => {
      if (uri) {
        const document = await vscode.workspace.openTextDocument(uri);
        document.save();
      }
    });
  }
};

export default createStructure;
