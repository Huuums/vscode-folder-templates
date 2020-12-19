import * as vscode from "vscode";
import createStructure from "../actions/createStructure";

import { FolderTemplate } from "../types";
import getReplaceValueTuples from "../lib/getReplaceValueTuples";
import { getLocalTemplatePath, getTargetPath } from "../lib/vscodeHelpers";
import { showError, showInfo } from "../lib/vscodeHelpers";
import { getAllFolderTemplates, pickTemplate } from "../lib/extensionHelpers";

const CreateFolderStructure = async (
  resource: vscode.Uri | string | undefined,
  globalTemplatePath: string
) => {
  const targetUri = await getTargetPath(resource);

  const templateFolderPath = getLocalTemplatePath() || globalTemplatePath;

  const folderTemplates: FolderTemplate[] = getAllFolderTemplates(
    templateFolderPath
  );

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
  } = pickedTemplate;

  const ffsNameTuple = await getReplaceValueTuples(["FFSName"]);
  //If no componentname is specified do nothing
  if (!ffsNameTuple[0][1]) {
    return showInfo("Aborted folder creation. Cannot continue without a name");
  }

  //Get all inputs for replacement of customvariables
  const replaceValueTuples = await getReplaceValueTuples(
    ([] as string[]).concat(customVariables || [])
  );

  await createStructure(
    ffsNameTuple.concat(replaceValueTuples),
    files,
    targetUri,
    omitParentDirectory
  );

  return "done";
};
export default CreateFolderStructure;
