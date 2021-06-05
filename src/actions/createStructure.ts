import * as vscode from "vscode";
import createFileOrDirectory from "../actions/createFileOrDirectory";
import { FileSettings } from "../types";
import { openAndSaveFile } from "../lib/vscodeHelpers";

const createStructure = async (
  structure: FileSettings[] | undefined,
) => {
  if (structure) {
    const wsedit = new vscode.WorkspaceEdit();
    const fileUris = await Promise.all(
      structure.map(
        createFileOrDirectory(
          wsedit
        )
      )
    );

    await vscode.workspace.applyEdit(wsedit);
    await Promise.all(fileUris.map(openAndSaveFile));

    return "done";
  }
};

export default createStructure;
