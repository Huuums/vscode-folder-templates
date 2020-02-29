import * as vscode from 'vscode';

export default async (uri: vscode.Uri | null) => {
  if (uri) {
    const document = await vscode.workspace.openTextDocument(uri);
    return document.save();
  }
};
