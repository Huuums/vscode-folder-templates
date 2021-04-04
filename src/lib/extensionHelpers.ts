import * as vscode from "vscode";
import { readdirSync, PathLike } from "fs";
import {
  FileSettings,
  FolderContent,
  FolderStructure,
  FolderTemplate,
  FolderTemplateConfig,
} from "../types";
import { getFileContent, getFolderContents } from "./fsHelpers";
import { readConfig } from "./vscodeHelpers";
import * as path from "path";

export const parseSettingsFile = (
  path: string
): FolderTemplateConfig | null => {
  const settings = getFileContent(path);
  if (!settings) {
    return null;
  }
  return JSON.parse(settings);
};

const convertFolderContentToStructure = (
  contents: FolderContent[],
  relativeTo: string
): FolderStructure => {
  return contents.map(
    (file): FileSettings => {
      return {
        fileName: path.relative(relativeTo, file.filePath),
        template: file.content || "",
      };
    }
  );
};

export const getTemplatesFromFS = (folderPath: PathLike) => {
  const fsTemplates = readdirSync(folderPath, { withFileTypes: true });
  return fsTemplates
    .map((file) => {
      if (!file.isDirectory()) {
        return null;
      }
      const settings =
        parseSettingsFile(`${folderPath}/${file.name}/.ftsettings.json`) || {};

        const contents = getFolderContents(
        vscode.Uri.file(`${folderPath}/${file.name}`)
      );

      const structure = convertFolderContentToStructure(
        contents,
        `${folderPath}/${file.name}`
      ).filter((val) => val.fileName !== ".ftsettings.json");

      return {
        ...settings,
        name: settings.name || file.name,
        structure,
      };
    })
    .filter(Boolean) as FolderTemplate[];
  //TS doesn't narrow the type from filtering correctly :'(
};

const getSelectedFolderStructure = (
  folderStructures: FolderTemplate[],
  structureName = "default"
) => {
  if (structureName !== "default") {
    const folderStructure = folderStructures?.find(
      (folderStructure) => folderStructure.name === structureName
    );
    if (!folderStructure) {
      vscode.window.showErrorMessage(
        "Could not find selected structure, please try again"
      );
      return null;
    }
    return folderStructure;
  }

  const folderStructure = folderStructures?.[0];
  if (!folderStructure) {
    vscode.window.showErrorMessage(
      "Something went wrong, could not find folderstructure"
    );
    return undefined;
  }
  return folderStructure;
};

export const pickTemplate = async (allStructures: FolderTemplate[]) => {
  //If more than one possible structure is configured prompt user to select which one
  let structureName = undefined;
  if (allStructures.length > 1) {
    structureName = await vscode.window.showQuickPick(
      allStructures.map((structure) => structure.name)
    );
  }

  return getSelectedFolderStructure(allStructures, structureName);
};
