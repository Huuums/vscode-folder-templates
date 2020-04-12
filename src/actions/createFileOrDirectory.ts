import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { FolderStructureFile, TemplateCollection } from '../types';
import {
  convertFileContentToString,
  replaceAllVariablesInString,
} from '../util';

const exists = promisify(fs.exists);

export default (
  replaceValues: string[][],
  basePath = '',
  wsedit: vscode.WorkspaceEdit,
) => async (fileInstructions: FolderStructureFile) => {
  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  const templates: TemplateCollection | undefined = config.get('fileTemplates');

  const [[, componentName]] = replaceValues;

  const targetFilePath = path.normalize(
    `${basePath}/${componentName}/${replaceAllVariablesInString(
      fileInstructions.fileName,
      replaceValues,
    )}`,
  );

  //don't do anything if file exists. just skip this file
  if (await exists(targetFilePath)) {
    vscode.window.showInformationMessage(
      `${targetFilePath} already exists. Skipping file`,
    );
    return null;
  }

  if (fileInstructions.template === 'EmptyDirectory') {
    fs.mkdirSync(targetFilePath, { recursive: true });
    return null;
  }

  const newPath = vscode.Uri.file(targetFilePath);
  wsedit.createFile(newPath, { ignoreIfExists: false });

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
