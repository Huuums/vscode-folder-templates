import * as vscode from 'vscode';
import * as path from 'path';
import { FolderStructure, TemplateCollection } from '../types';
import { getFolderContents } from '../util';

const createTemplateFromFolder = async (resource: vscode.Uri | undefined) => {
  if (!resource) {
    vscode.window.showErrorMessage(
      'Fast Folder Structure could not find the folder for some reason.',
    );
    return false;
  }

  const templateName = await vscode.window.showInputBox({
    placeHolder: 'Please enter the name of your new Template.',
  });
  const fileAndFolderPaths = getFolderContents(resource);
  if (!fileAndFolderPaths?.length) {
    return;
  }
  const filesToCreateTemplateFrom = await vscode.window.showQuickPick(
    fileAndFolderPaths
      .filter((currentPath) =>
        Boolean(
          currentPath.content && currentPath.content !== 'EmptyDirectory',
        ),
      )
      .map((currentPath) => ({
        content: currentPath.content,
        label: vscode.workspace.asRelativePath(currentPath.filePath),
        picked: true,
        description: `full file path: ${currentPath.filePath}`,
        filePath: currentPath.filePath,
      })),
    {
      placeHolder:
        'Choose the Files from which you would like to create file templates',
      canPickMany: true,
    },
  );

  const fileTemplates = filesToCreateTemplateFrom?.reduce(
    (acc, currentFile) => {
      return {
        ...acc,
        [path
          .relative(resource.fsPath, currentFile.filePath)
          .replace(/\\/g, '-')]: currentFile.content.split('\n'),
      };
    },
    {},
  );

  const structure = fileAndFolderPaths.map((currentFile) => {
    const template = filesToCreateTemplateFrom?.find(
      (row) => row.filePath === currentFile.filePath,
    );
    const fileName = path
      .relative(resource.fsPath, currentFile.filePath)
      .replace(/\\/g, '/');
    if (template) {
      const templateName = path
        .relative(resource.fsPath, template.filePath)
        .replace(/\\/g, '-');

      return { fileName, template: templateName };
    }
    if (currentFile.content === 'EmptyDirectory') {
      return { fileName, template: 'EmptyDirectory' };
    }
    return { fileName };
  });

  const config = vscode.workspace.getConfiguration('fastFolderStructure');
  config.get('structures');
  await config.update('structures', [
    ...((config.get('structures') as FolderStructure[] | undefined) || []),
    { name: templateName, structure },
  ]);
  await config.update('fileTemplates', {
    ...(config.get('fileTemplates') as TemplateCollection),
    ...fileTemplates,
  });
  // let selectedStructureName = undefined;
  // //If more than one possible structure is configured prompt user to select which one
  // if (folderStructures && folderStructures.length > 1) {
  //   selectedStructureName = await vscode.window.showQuickPick(
  //     folderStructures.map((structure: FolderStructure) => structure.name),
  //   );
  // }
  // const selectedFolderStructure = getStructure(
  //   folderStructures || [],
  //   selectedStructureName,
  // );
  // if (!selectedFolderStructure) {
  //   return;
  // }
  // const { customVariables, structure: files } = selectedFolderStructure;

  // const ffsNameTuple = await getReplaceValueTuples(['FFSName']);
  // //If no componentname is specified do nothing
  // if (!ffsNameTuple[0][1]) {
  //   return false;
  // }

  // //Get all inputs for replacement of customvariables
  // const replaceValueTuples = await getReplaceValueTuples([
  //   ...(customVariables || []),
  // ]);

  // if (folderStructures) {
  //   await createStructure(
  //     [...ffsNameTuple, ...replaceValueTuples],
  //     files,
  //     resource,
  //   );
  // }
  return 'done';
};
export default createTemplateFromFolder;
