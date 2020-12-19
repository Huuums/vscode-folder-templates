import * as vscode from "vscode";
import createFolderStructure from "./commands/createFolderStructure";
// import createTemplateFromFolder from "./commands/createTemplateFromFolder";
// import removeTemplate from "./commands/removeTemplate";
import { createDirectory, isDirectory } from "./lib/fsHelpers";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const globalTemplateFolderPath = context.asAbsolutePath(".fttemplates");

  let createStructure = vscode.commands.registerCommand(
    "FFS.createFolderStructure",
    (resource) => {
      return createFolderStructure(resource, globalTemplateFolderPath);
    }
  );

  context.subscriptions.push(createStructure);
}

// this method is called when your extension is deactivated
export function deactivate() {}
