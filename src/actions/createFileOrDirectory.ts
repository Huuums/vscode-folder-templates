import * as vscode from 'vscode';
import * as fs from 'fs';
import { FolderStructureFile, TemplateCollection } from '../types';
import { replaceAll, getFileContentStringAndReplacePlaceholder } from '../util';

export default (
  componentName: string,
  basePath = '',
  wsedit: vscode.WorkspaceEdit,
) => (fileInstructions: FolderStructureFile) => {
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

  if (fileInstructions.template) {
    return newPath;
  }
  return null;
};
