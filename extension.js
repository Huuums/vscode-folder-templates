// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const getFileContentString = require('./util/helper').getFileContentString;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "fast-component-folders" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.createFolderStructure',
    async function(resource) {
      // The code you place here will be executed every time your command is executed
      // Get configured Folder Structure
      const config = vscode.workspace.getConfiguration('fastComponentFolders');
      const folderStructure = config.get('componentFolderStructure');
      // UserInput for the component name
      const componentName = await vscode.window.showInputBox({
        placeHolder: 'Enter your Component Name',
      });
      if (componentName) {
        const wsedit = new vscode.WorkspaceEdit();
        folderStructure.forEach(file => {
          const newPath = vscode.Uri.file(
            `${resource.fsPath}/${componentName}/${file.fileName.replace(
              '<name>',
              componentName,
            )}`,
          );
          wsedit.createFile(newPath, { ignoreIfExists: true });

          wsedit.insert(
            newPath,
            new vscode.Position(0, 0),
            getFileContentString(file.content, '<name>', componentName),
          );
        });
        await vscode.workspace.applyEdit(wsedit);
        //vscode.window.activeTextEditor.hide();
      }
    },
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
