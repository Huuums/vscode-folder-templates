import * as vscode from "vscode";
import createStructure from "../actions/createStructure";
import getStructure from "../lib/getSelectedFolderStructure";
import { FolderStructure } from "../types";
import getReplaceValueTuples from "../lib/getReplaceValueTuples";
import getTargetPath from "../lib/pathUtils";

const CreateFolderStructure = async (
  resource: vscode.Uri | string | undefined
) => {
  const targetUri = await getTargetPath(resource);

  const config = vscode.workspace.getConfiguration("fastFolderStructure");
  const folderStructures: FolderStructure[] | undefined = config.get(
    "structures"
  );
  let selectedStructureName = undefined;
  //If more than one possible structure is configured prompt user to select which one
  if (folderStructures && folderStructures.length > 1) {
    selectedStructureName = await vscode.window.showQuickPick(
      folderStructures.map((structure: FolderStructure) => structure.name)
    );
  }
  const selectedFolderStructure = getStructure(
    folderStructures || [],
    selectedStructureName
  );
  if (!selectedFolderStructure) {
    return;
  }
  const {
    customVariables,
    structure: files,
    omitParentDirectory,
  } = selectedFolderStructure;

  const ffsNameTuple = await getReplaceValueTuples(["FFSName"]);
  //If no componentname is specified do nothing
  if (!ffsNameTuple[0][1]) {
    return Promise.resolve();
  }

  //Get all inputs for replacement of customvariables
  const replaceValueTuples: string[][] = await getReplaceValueTuples([
    ...(customVariables || []),
  ]);

  if (folderStructures) {
    await createStructure(
      [...ffsNameTuple, ...replaceValueTuples],
      files,
      targetUri,
      omitParentDirectory
    );
  }
  return "done";
};
export default CreateFolderStructure;
