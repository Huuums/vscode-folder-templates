import * as vscode from 'vscode';
import * as fs from 'fs';
import { FolderStructureFile, TemplateCollection } from '../types';
import {
  convertFileContentToString,
  replaceAllVariablesInString,
} from '../util';

export default (
  replaceValues: string[][],
  basePath = '',
  wsedit: vscode.WorkspaceEdit,
) => async (fileInstructions: FolderStructureFile) => {
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const templates: TemplateCollection | undefined = config.get('fileTemplates');

  const [[, componentName]] = replaceValues;

  const targetFilePath = `${basePath}/${componentName}/${replaceAllVariablesInString(
    fileInstructions.fileName,
    replaceValues,
  )}`;

  if (fileInstructions.template === 'EmptyDirectory') {
    fs.mkdirSync(targetFilePath, { recursive: true });
    return null;
  }

  const newPath = vscode.Uri.file(targetFilePath);
  wsedit.createFile(newPath, { ignoreIfExists: true });

  const template = templates?.[fileInstructions.template];

  const fileContent = replaceAllVariablesInString(
    convertFileContentToString(template),
    replaceValues,
  );

  wsedit.insert(newPath, new vscode.Position(0, 0), fileContent);

  if (fileInstructions.template) {
    return newPath;
  }
  return null;
};
