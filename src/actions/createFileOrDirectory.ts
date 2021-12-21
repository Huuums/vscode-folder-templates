import * as vscode from "vscode";
import {
  FileSettings,
  FileTemplateCollection,
} from "../types";

import { createDirectory, fileExists } from "../lib/fsHelpers";


export default (
  wsedit: vscode.WorkspaceEdit
) => async (file: FileSettings) => {

  if (file.template === "EmptyDirectory") {
    createDirectory(file.fileName);
    return null;
  }

  const newPath = vscode.Uri.file(file.fileName);
  let existingFile: boolean = false;
  if(fileExists(file)) { existingFile = true; }

  if(existingFile) {
    wsedit.replace(newPath, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(99999, 99999)), file.template as string);
  } else {
    wsedit.createFile(newPath);
    wsedit.insert(newPath, new vscode.Position(0, 0), file.template as string);
  }

  if (file.template) {
    return newPath;
  }
  return null;
};
