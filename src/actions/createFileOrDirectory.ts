import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import {
  FileSettings,
  FileTemplateCollection,
  StringReplaceTuple,
} from "../types";
import {
  convertFileContentToString,
  replaceAllVariablesInString,
} from "../lib/stringHelpers";
import { readConfig, showInfo } from "../lib/vscodeHelpers";
import { createDirectory } from "../lib/fsHelpers";

const exists = promisify(fs.exists);

const isStringReplaceTuple = (
  val: StringReplaceTuple[] | []
): val is StringReplaceTuple[] => {
  return val[0] !== undefined;
};

export default (
  replaceValues: StringReplaceTuple[],
  basePath = "",
  omitParentDirectory: boolean,
  wsedit: vscode.WorkspaceEdit
) => async (fileInstructions: FileSettings) => {
  const templates: FileTemplateCollection | undefined = readConfig(
    "fileTemplates"
  );

  let componentName: undefined | string;
  if (isStringReplaceTuple(replaceValues)) {
    [[, componentName]] = replaceValues;
  }

  let filePath;
  if (omitParentDirectory || !componentName) {
    filePath = path.normalize(
      `${basePath}/${replaceAllVariablesInString(
        fileInstructions.fileName,
        replaceValues
      )}`
    );
  } else {
    filePath = path.normalize(
      `${basePath}/${componentName}/${replaceAllVariablesInString(
        fileInstructions.fileName,
        replaceValues
      )}`
    );
  }

  //don't do anything if file exists. just skip this file
  if (await exists(filePath)) {
    showInfo(`${filePath} already exists. Skipping file`);
    return null;
  }

  if (fileInstructions.template === "EmptyDirectory") {
    createDirectory(filePath);
    return null;
  }

  const newPath = vscode.Uri.file(filePath);
  wsedit.createFile(newPath, { ignoreIfExists: false });

  let template;
  if (typeof fileInstructions.template === "string") {
    template =
      templates?.[fileInstructions.template || ""] || fileInstructions.template;
  } else {
    template = fileInstructions.template;
  }

  const fileContent = replaceAllVariablesInString(
    convertFileContentToString(template),
    replaceValues
  );

  wsedit.insert(newPath, new vscode.Position(0, 0), fileContent);

  if (fileInstructions.template) {
    return newPath;
  }
  return null;
};
