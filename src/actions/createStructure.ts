import * as vscode from "vscode";
import createFileOrDirectory from "../actions/createFileOrDirectory";
import { FileSettings, TemplateNotation } from "../types";
import { openAndSaveFile } from "../lib/vscodeHelpers";

const createStructure = async (
  structure: FileSettings[] | undefined,
  templateNotation: TemplateNotation
) => {
  if (structure) {
    const wsedit = new vscode.WorkspaceEdit();
    const fileUris = await Promise.all(
      structure.map(createFileOrDirectory(wsedit, templateNotation))
    );

    await vscode.workspace.applyEdit(wsedit);
    await Promise.all(fileUris.map((file) => openAndSaveFile(file?.filePath)));
    return fileUris;
  }
};

export default createStructure;
