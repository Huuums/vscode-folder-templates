import * as vscode from "vscode";
import createStructure from "../actions/createStructure";

import { FolderTemplate, StringReplaceTuple } from "../types";
import getReplaceValueTuples from "../lib/getReplaceValueTuples";
import {
  getLocalTemplatePath,
  getTargetPath,
  readConfig,
} from "../lib/vscodeHelpers";
import { showError, showInfo } from "../lib/vscodeHelpers";
import { getTemplatesFromFS, pickTemplate } from "../lib/extensionHelpers";
import { isDirectory } from "../lib/fsHelpers";

const CreateFolderStructure = async (
  resource: vscode.Uri | string | undefined,
  globalTemplatePath: string
) => {
  const targetUri = await getTargetPath(resource);

  const templateFolderPath = [await getLocalTemplatePath(targetUri), globalTemplatePath];
  const validPaths = templateFolderPath.filter(isDirectory) as string[];

  const configTemplates: FolderTemplate[] = readConfig("structures") || [];
  const folderTemplates: FolderTemplate[] = validPaths
    .map((path: string) => getTemplatesFromFS(path))
    .flat()
    .concat(configTemplates);

  if (!folderTemplates.length) {
    return showError("No configured Folder Templates found!");
  }

  const pickedTemplate = await pickTemplate(folderTemplates);

  if (!pickedTemplate) {
    return showInfo(
      "Aborted folder creation. Cannot continue without template selection."
    );
  }

  const {
    customVariables,
    structure: files,
    omitParentDirectory,
    omitFTName,
  } = pickedTemplate;

  if (omitFTName && !omitParentDirectory) {
    return showError(
      "omitFTName option can only be true when omitParentDirectory is true as well."
    );
  }

  let ftNameTuple: StringReplaceTuple[] = [];
  if (!omitFTName) {
    ftNameTuple = await getReplaceValueTuples(["FTName"]);
    //If no componentname is specified do nothing
    if (!ftNameTuple[0][1]) {
      return showInfo(
        "Aborted folder creation. Cannot continue without a name"
      );
    }
  }

  //Get all inputs for replacement of customvariables
  const replaceValueTuples = await getReplaceValueTuples(customVariables || []);
  await createStructure(
    ftNameTuple.concat(replaceValueTuples),
    files,
    targetUri,
    omitParentDirectory
  );

  return "done";
};
export default CreateFolderStructure;
