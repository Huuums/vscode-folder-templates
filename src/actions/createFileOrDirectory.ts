import * as vscode from "vscode";
import {
  FileSettings,
  TemplateNotation,
} from "../types";

import { createDirectory, fileExists, getFileContent } from "../lib/fsHelpers";
import { replaceAllVariablesInString } from "../lib/stringHelpers";


export default (
  wsedit: vscode.WorkspaceEdit,
  templateNotation: TemplateNotation,
) => async (file: FileSettings) => {

  if (file.template === "EmptyDirectory") {
    createDirectory(file.fileName);
    return null;
  }

  const newPath = vscode.Uri.file(file.fileName);

  if(fileExists(file)) {
    if(file.template?.includes("__existingcontent__")) {
      const currentFileContent = getFileContent(file.fileName);
      wsedit.replace(newPath, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(99999, 99999)), replaceAllVariablesInString(file.template as string, [['__existingcontent__', currentFileContent ||'']], templateNotation));
    } else {
      wsedit.replace(newPath, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(99999, 99999)), file.template as string);
    }

  } else {
    wsedit.createFile(newPath);
    wsedit.insert(newPath, new vscode.Position(0, 0), file.template as string);
  }

  if (file.template) {
    return newPath;
  }
  return null;
};
