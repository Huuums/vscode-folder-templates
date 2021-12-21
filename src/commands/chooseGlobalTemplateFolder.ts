import * as vscode from "vscode";

export default () => {
   const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFiles: false,
        canSelectFolders: true
    };

   vscode.window.showOpenDialog(options).then(fileUri => {
       if (fileUri && fileUri[0]) {
         const config = vscode.workspace.getConfiguration("folderTemplates");
         config.update("globalTemplateDirectoryPath", fileUri[0].fsPath, true);
       }
   });
   return "done";
};