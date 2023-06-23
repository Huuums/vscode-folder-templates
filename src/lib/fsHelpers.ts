import * as vscode from "vscode";
import {
  readdirSync,
  readFileSync,
  PathLike,
  existsSync,
  lstatSync,
  mkdirSync,
} from "fs";
import {normalize} from 'path';
import { FileSettings, FolderContent, StringReplaceTuple, TemplateNotation } from "../types";
import { replaceAllVariablesInString } from "./stringHelpers";

export const getFileContent = (path: string) => {
  try {
    return readFileSync(normalize(path), {
      encoding: "utf8",
    });
  } catch (e) {
    console.log({e});
    return null;
  }
};

export const getFolderContents = (uri: vscode.Uri): FolderContent[] => {
  try {
    const files = readdirSync(uri.fsPath, { withFileTypes: true });
    const allPaths = files.map((file) => {
      if (file.isDirectory()) {
        return getFolderContents(vscode.Uri.joinPath(uri, file.name));
      }
      return [
        {
          filePath: vscode.Uri.joinPath(uri, file.name).fsPath,
          content: getFileContent(`${uri.fsPath}/${file.name}`),
        },
      ];
    });
    if (allPaths.length === 0) {
      return [
        {
          filePath: uri.fsPath,
          content: "EmptyDirectory",
        },
      ];
    }
    return allPaths.flat(Infinity) as FolderContent[];
  } catch (e) {
    vscode.window.showErrorMessage(
      "Something went wrong getting Folder contents"
    );
    return [];
  }
};

export const isDirectory = (path: PathLike | null) => {
  if (path === null) {
    return false;
  }
  return existsSync(path) && lstatSync(path).isDirectory();
};

export const createDirectory = (path: PathLike) => {
  mkdirSync(path, { recursive: true });
};

export const getFullFilePath = (fileName: string, resourcePath = '', replaceValues: StringReplaceTuple[] | [], omitParentDirectory: boolean, templateNotation: TemplateNotation) => {
  let componentName = "";
  if(replaceValues.length > 0) {
    ([[, componentName]] = replaceValues);
  }

  if(omitParentDirectory){
    return normalize(
      `${resourcePath}/${replaceAllVariablesInString(
        fileName,
        replaceValues,
        templateNotation
        ).trim()}`
    );
  }
  return normalize(
  `${resourcePath}/${componentName.trim()}/${replaceAllVariablesInString(
    fileName,
    replaceValues,
    templateNotation
  ).trim()}`);
};

export const fileExistsByName = (fileName: string) => {
  return existsSync(fileName);
};

export const fileExists = (file: FileSettings) => {
  return existsSync(file.fileName);
};