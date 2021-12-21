import { normalize } from "path";
import * as vscode from "vscode";
import { isDirectory, fileExistsByName } from "./fsHelpers";

export const readConfig = (key: string): any => {
  const config = vscode.workspace.getConfiguration("folderTemplates");
  return config.get(key);
};

export const showError = (message: string) => {
  vscode.window.showErrorMessage(message);
};
export const showInfo = (message: string) => {
  vscode.window.showInformationMessage(message);
};

const parentFolderOfActiveFile = () => {
  const currentFolderUri = vscode.window.activeTextEditor?.document?.uri
    ?.toString()
    ?.replace(/\/([^/]+)$/, "");

  if (currentFolderUri) {
    return vscode.Uri.parse(currentFolderUri, true);
  }
  return undefined;
};

export const getWorkspaceUri = async () => {
  if ((vscode.workspace.workspaceFolders?.length || 0) > 1) {
    return (
      await vscode.window.showWorkspaceFolderPick({
        placeHolder: "Select Workspace in which you want to create the folder",
      })
    )?.uri;
  }
  return vscode.workspace.workspaceFolders?.[0]?.uri;
};

export const getTargetPath = async (
  resource: vscode.Uri | string | undefined,
  workspaceUri: vscode.Uri | undefined,

) => {
  if (typeof resource === "string") {
    if (resource === "__current") {
      return parentFolderOfActiveFile();
    }

    if (!workspaceUri) {
      vscode.window.showErrorMessage("Couldn't find workspace");
      return;
    }
    return vscode.Uri.parse(workspaceUri + "/" + resource);
  }
  if (!resource && vscode.workspace.workspaceFolders) {
    // if command is triggered via command box and not via context menu let user enter path where component should be created
    const filePath = await vscode.window.showInputBox({
      placeHolder:
        "Enter the relative to project root path where your folder should be created",
    });
    return vscode.Uri.parse(workspaceUri + "/" + filePath, true);
  }

  return resource as vscode.Uri | undefined;
};

export const openAndSaveFile = async (uri: vscode.Uri | null) => {
  if (uri) {
    const document = await vscode.workspace.openTextDocument(uri);
    return document.save();
  }
};

export const openFile = async (filePath: string) => {
  if (fileExistsByName(filePath)){
    return await vscode.window.showTextDocument(vscode.Uri.file(filePath), { preview: false });
  }
};

export const getLocalTemplatePath = async (resourceUri: vscode.Uri | undefined) => {
  const configTemplateFolderPath = readConfig('templateFolderPath') || '.fttemplates';
  let workspace: vscode.WorkspaceFolder | undefined;
  if(resourceUri){
    workspace = vscode.workspace.getWorkspaceFolder(resourceUri);
  } else {
    workspace = await vscode.window.showWorkspaceFolderPick({placeHolder: "Pick the workspace in which you would like to create the Folder"});
  }
  if(workspace){
    const templateFolderPath = `${workspace.uri.fsPath}/${configTemplateFolderPath}`;
    if (isDirectory(templateFolderPath)) {
      // Match any TypeScript file in the root of this workspace folder
      return templateFolderPath;
      // Match any TypeScript file in `someFolder` inside this workspace folder
    }
  }
  return null;
};

export const getGlobalTemplatePath = (defaultPath: string) =>  {
  const configuredPath = readConfig('globalTemplateDirectoryPath');
  if(configuredPath){
    return normalize(configuredPath);
  }
  return defaultPath;
};