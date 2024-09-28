import * as vscode from 'vscode';
import createStructure from '../actions/createStructure';

import { FolderStructure, FolderTemplate, StringReplaceTuple } from '../types';
import getReplaceValueTuples from '../lib/getReplaceValueTuples';
import {
  getGlobalTemplatePath,
  getLocalTemplatePath,
  getTargetPath,
  openFile,
  readConfig,
} from '../lib/vscodeHelpers';
import { showError, showInfo, getWorkspaceUri } from '../lib/vscodeHelpers';
import {
  getTemplatesFromFS,
  pickTemplate,
  replaceTemplateContent,
} from '../lib/extensionHelpers';
import { fileExists, getFullFilePath, isDirectory } from '../lib/fsHelpers';
import { relative } from 'path';
import { chmodSync } from 'fs';
import { minimatch } from 'minimatch';

const CreateFolderStructure = async (
  resource: vscode.Uri | string | undefined,
  globalTemplatePath: string
) => {
  const workspaceUri = await getWorkspaceUri();
  const targetUri = await getTargetPath(resource, workspaceUri);

  const templateFolderPaths = [
    await getLocalTemplatePath(targetUri),
    getGlobalTemplatePath(globalTemplatePath),
  ];

  const validPaths = templateFolderPaths.filter(isDirectory) as string[];

  const configTemplates: FolderTemplate[] = readConfig('structures') || [];
  const folderTemplates: FolderTemplate[] = validPaths
    .map((path: string) => getTemplatesFromFS(path))
    .flat()
    .concat(configTemplates);

  if (!folderTemplates.length) {
    return showError('No configured Folder Templates found!');
  }

  const pickedTemplate = await pickTemplate(folderTemplates);

  if (!pickedTemplate) {
    return showInfo(
      'Aborted folder creation. Cannot continue without template selection.'
    );
  }

  const {
    customVariables,
    structure: files,
    openFilesWhenDone,
    omitParentDirectory = false,
    omitFTName = false,
    overwriteExistingFiles = 'never',
    absolutePath = false,
    setExecutablePermission = false,
    ignoreFiles = [],
  } = pickedTemplate;

  const templateNotation =
    pickedTemplate.templateNotation || readConfig('templateNotation');

  if (omitFTName && !omitParentDirectory) {
    return showError(
      'omitFTName option can only be true when omitParentDirectory is true as well.'
    );
  }

  if (absolutePath && !omitParentDirectory) {
    return showError(
      'absolutePath option can only be true when omitParentDirectory is true as well.'
    );
  }

  let ftNameTuple: StringReplaceTuple[] = [];
  if (!omitFTName) {
    try {
      ftNameTuple = await getReplaceValueTuples(['FTName']);
      //If no componentname is specified do nothing
      if (!ftNameTuple[0][1]) {
        return showInfo(
          'Aborted folder creation. Cannot continue without a name'
        );
      }
    } catch (e: any) {
      if (e && e.message === 'Cancelled') {
        return showInfo('Aborted folder creation. Cancelled input');
      }
    }
  }

  const fsPath = (absolutePath ? workspaceUri : targetUri)?.fsPath;
  //Get all inputs for replacement of customvariables
  const pathTuples: StringReplaceTuple[] = `${fsPath}`.split('\\').map((p, i) => [`Path${i}`, p]);
  const replaceValueTuples = ftNameTuple.concat(
    await getReplaceValueTuples(customVariables || [])
  ).concat(pathTuples);
  const structureContents = files.map((row) => ({
    isExecutable: row.isExecutable,
    fileName: getFullFilePath(
      row.fileName,
      fsPath,
      replaceValueTuples,
      omitParentDirectory,
      templateNotation
    ),
    template: replaceTemplateContent(
      row.template,
      replaceValueTuples,
      templateNotation
    ),
  }));

  let filesToCreate: FolderStructure;

  if (overwriteExistingFiles === 'always') {
    filesToCreate = structureContents;
  } else if (overwriteExistingFiles === 'prompt') {
    //Doesn't work yet. Fix when coming back. Files to create are figured out in a wrong way
    const existingFiles = structureContents.filter(fileExists);
    const newFiles = structureContents.filter((file) => !fileExists(file));
    const filesToOverwrite = existingFiles.length
      ? (await vscode.window.showQuickPick(
          existingFiles.map((row) => ({
            ...row,
            label: relative(fsPath || '', row.fileName),
          })),
          {
            canPickMany: true,
            placeHolder: 'Please select the files that should be overwritten',
          }
        )) || []
      : [];
    filesToCreate = newFiles.concat(
      structureContents.filter((file) =>
        filesToOverwrite.find((row) => row.fileName === file.fileName)
      )
    );
  } else {
    filesToCreate = structureContents.filter((file) => !fileExists(file));
    structureContents
      .filter(fileExists)
      .forEach((file) =>
        showInfo(
          `Skipped creating file ${file.fileName} because it exists already`
        )
      );
  }

  const createdFiles = await createStructure(
    filesToCreate,
    templateNotation,
    ignoreFiles
  );

  if (setExecutablePermission && createdFiles && createdFiles.length > 0) {
    createdFiles.forEach(
      (
        file:
          | {
              filePath: string;
              isExecutable: boolean;
            }
          | {
              isExecutable: boolean;
              filePath?: undefined;
            }
          | null
      ) => {
        if (file && file.isExecutable && file.filePath) {
          chmodSync(file.filePath, '755');
        }
      }
    );
  }

  if (openFilesWhenDone && fsPath) {
    await Promise.all(
      openFilesWhenDone.map((file) =>
        openFile(
          getFullFilePath(
            file,
            fsPath,
            replaceValueTuples,
            omitParentDirectory,
            templateNotation
          )
        )
      )
    );
  }

  return 'done';
};
export default CreateFolderStructure;
