import * as vscode from 'vscode';
import * as fs from 'fs';
import { FolderStructureFile, TemplateCollection } from '../types';
import { replaceAll, getFileContentStringAndReplacePlaceholder } from '../util';

export default (componentName: string, basePath = '') => async (
  fileInstructions: FolderStructureFile,
) => {
  const wsedit = new vscode.WorkspaceEdit();
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const templates: TemplateCollection | undefined = config.get('fileTemplates');

  const ffsTransformRegexp = /<FFSName(?:\s*\|\s*([A-Za-z]+))?>/;

  const targetFilePath = `${basePath}/${componentName}/${replaceAll(
    fileInstructions.fileName,
    ffsTransformRegexp,
    componentName,
  )}`;

  if (fileInstructions.template === 'EmptyDirectory') {
    fs.mkdirSync(targetFilePath, { recursive: true });
    return null;
  }

  const newPath = vscode.Uri.file(targetFilePath);
  wsedit.createFile(newPath, { ignoreIfExists: true });

  const template = templates?.[fileInstructions.template];

  wsedit.insert(
    newPath,
    new vscode.Position(0, 0),
    getFileContentStringAndReplacePlaceholder(
      template,
      ffsTransformRegexp,
      componentName,
    ),
  );

  await vscode.workspace.applyEdit(wsedit);
  if (fileInstructions.template) {
    return newPath;
  }
  return null;
};
