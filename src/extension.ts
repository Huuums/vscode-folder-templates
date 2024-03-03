import * as vscode from 'vscode';
import createFolderStructure from './commands/createFolderStructure';
import openGlobalTemplatePath from './commands/openGlobalTemplatePath';
import chooseGlobalTemplateFolder from './commands/chooseGlobalTemplateFolder';
import { isDirectory, isFile } from './lib/fsHelpers';
import { showError } from './lib/vscodeHelpers';
import { normalize } from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const globalTemplateFolderPath = context.asAbsolutePath('.fttemplates');

  const createStructure = vscode.commands.registerCommand(
    'FT.createFolderStructure',
    async (resource) => {
      let newUri = resource; // folder will be undefined when triggered by keybinding
      if (!resource) {
        // so triggered by a keybinding
        const originalClipboard = await vscode.env.clipboard.readText();

        await vscode.commands.executeCommand('copyFilePath');
        resource = await vscode.env.clipboard.readText(); // returns a string

        await vscode.env.clipboard.writeText(originalClipboard);

        // see note below for parsing multiple files/folders
        if (isFile(normalize(resource))) {
          showError(
            'Can only create templates in directories. Please select a directory in the explorer.'
          );
          return;
        }
        if (isDirectory(normalize(resource))) {
          newUri = vscode.Uri.file(resource); // make it a Uri
        } else {
          newUri = undefined;
        }
      }
      return createFolderStructure(newUri, globalTemplateFolderPath);
    }
  );

  const openFolderTemplatesGlobalFolder = vscode.commands.registerCommand(
    'FT.openGlobalFolder',
    () => {
      return openGlobalTemplatePath(globalTemplateFolderPath);
    }
  );

  const chooseFolderTemplatesGlobalFolder = vscode.commands.registerCommand(
    'FT.chooseCustomGlobalTemplateFolder',
    () => {
      return chooseGlobalTemplateFolder();
    }
  );

  context.subscriptions.push(createStructure);
  context.subscriptions.push(openFolderTemplatesGlobalFolder);
  context.subscriptions.push(chooseFolderTemplatesGlobalFolder);
}

// this method is called when your extension is deactivated
export function deactivate() {}
