import * as vscode from 'vscode';
import * as path from 'path';
import {
  FolderStructureFile,
  TemplateCollection,
  FileQuickPickItem,
  FolderStructure,
} from '../types';
import {
  getFolderContents,
  removeEmptyDirectories,
  getPossibleFFSTemplateVariables,
  shouldCreateTemplateFromFile,
  unique,
} from '../util';
import * as htmlTags from 'html-tags';

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

  const folderContents = getFolderContents(resource);
  if (!folderContents?.length || !templateName) {
    return;
  }

  const fileQuickpickItems: FileQuickPickItem[] = folderContents.map(
    (currentPath) => ({
      content: currentPath.content || '',
      label: vscode.workspace.asRelativePath(currentPath.filePath),
      picked: true,
      description: `full file path: ${currentPath.filePath}`,
      filePath: currentPath.filePath,
    }),
  );

  //let user pick which files should be converted to templates
  const templateFiles = await vscode.window.showQuickPick(
    removeEmptyDirectories(fileQuickpickItems),
    {
      placeHolder:
        'Choose the Files from which you would like to create file templates',
      canPickMany: true,
    },
  );

  // get all strings inside < > or [] inside filename and if file is supposed to be converted to a template from file content as well.
  const possibleCustomVariables = fileQuickpickItems
    ?.map(getPossibleFFSTemplateVariables(templateFiles))
    .flat()
    .reduce((acc, row) => unique<string>(acc, row), [] as Array<string>)
    .filter((row) => {
      return (
        row !== 'FFSName' && !htmlTags.includes(row.replace('/', '').trim())
      );
    });

  let customVariables: string[] | [] = [];
  if (possibleCustomVariables.length > 0) {
    const pickedCustomVariables = await vscode.window.showQuickPick(
      possibleCustomVariables.map((row) => ({ label: row, picked: true })),
      {
        canPickMany: true,
        placeHolder:
          'Found multiple strings that could be customVariables for FFS Template, please select the ones that are custom FFS-Variables',
      },
    );
    customVariables = pickedCustomVariables?.map((row) => row.label) || [];
  }

  const getFileTemplateName = (filePath: string) => {
    return `${templateName}-${path
      .relative(resource.fsPath, filePath)
      .replace(/\\/g, '-')}`;
  };

  const fileTemplates: TemplateCollection | undefined = templateFiles?.reduce(
    (acc, currentFile) => {
      return {
        ...acc,
        [getFileTemplateName(currentFile.filePath)]: currentFile.content.split(
          '\n',
        ),
      };
    },
    {},
  );

  const structure: FolderStructureFile[] = folderContents.map((currentFile) => {
    const fileName = path
      .relative(resource.fsPath, currentFile.filePath)
      .replace(/\\/g, '/');
    if (shouldCreateTemplateFromFile(templateFiles, currentFile.filePath)) {
      const name = getFileTemplateName(currentFile.filePath);
      return { fileName, template: name };
    }
    if (currentFile.content === 'EmptyDirectory') {
      return {
        fileName,
        template: 'EmptyDirectory',
      };
    }
    return { fileName };
  });

  const config = vscode.workspace.getConfiguration('fastFolderStructure');

  const hasWorkspaceConfig =
    Boolean(config.inspect('fileTemplates')?.workspaceValue) ||
    Boolean(config.inspect('structures')?.workspaceValue);

  const configStructures = config.get('structures');
  const configFileTemplates = config.get('fileTemplates');

  await config.update(
    'structures',
    [
      ...((configStructures as FolderStructure[] | undefined) || []),
      { name: templateName, customVariables: customVariables, structure },
    ],
    !hasWorkspaceConfig,
  );
  await config.update(
    'fileTemplates',
    {
      ...(configFileTemplates as TemplateCollection),
      ...fileTemplates,
    },
    !hasWorkspaceConfig,
  );

  return 'done';
};
export default createTemplateFromFolder;
