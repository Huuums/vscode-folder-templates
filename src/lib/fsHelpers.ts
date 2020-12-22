import * as vscode from "vscode";
import {
  readdirSync,
  readFileSync,
  PathLike,
  existsSync,
  lstatSync,
  mkdirSync,
} from "fs";
import { FolderContent } from "../types";

export const getFileContent = (path: PathLike) => {
  try {
    let fileContent = readFileSync(path, {
      encoding: "utf8",
    });
    return fileContent;
  } catch (e) {
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
