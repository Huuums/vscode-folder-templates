import * as vscode from "vscode";
import { normalize } from "path";

const getTargetPath = async (resource: vscode.Uri | string | undefined) => {
  if (typeof resource === "string") {
    if (resource === "__current") {
      const fileUri = vscode.window.activeTextEditor?.document?.uri.toString();
      console.log(fileUri);
      const fileUriSplits = fileUri?.split("/");
      const targetUri = fileUriSplits?.slice(0, -1).join("/");
      if (targetUri) {
        return vscode.Uri.parse(targetUri, true);
      }
    } else {
      const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!workspaceUri) {
        vscode.window.showErrorMessage("Couldn't find workspace");
        return;
      }
      return vscode.Uri.parse(workspaceUri + "/" + resource);
    }
  }
  if (!resource && vscode.workspace.workspaceFolders) {
    // if command is triggered via command box and not via context menu let user enter path where component should be created
    let activeWorkspace = vscode.workspace.workspaceFolders[0].uri;
    if (vscode.workspace.workspaceFolders.length > 1) {
      activeWorkspace =
        (
          await vscode.window.showWorkspaceFolderPick({
            placeHolder:
              "Select Workspace in which you want to create the Structure",
          })
        )?.uri || activeWorkspace;
    }

    return vscode.Uri.parse(
      activeWorkspace +
        "/" +
        ((await vscode.window.showInputBox({
          placeHolder:
            "Enter Path where component should be created (relative to project root)",
        })) || ""),
      true
    );
  }

  return resource as vscode.Uri | undefined;
};

export default getTargetPath;
