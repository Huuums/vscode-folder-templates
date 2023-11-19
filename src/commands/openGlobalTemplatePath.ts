import open from "open";

import { isDirectory } from "../lib/fsHelpers";
import { getGlobalTemplatePath, showError } from "../lib/vscodeHelpers";

export default (defaultGlobalPath: string) => {
  const globalTemplatePath = getGlobalTemplatePath(defaultGlobalPath);
  if (globalTemplatePath) {
    if (!isDirectory(globalTemplatePath)) {
      showError(
        `The configured global template directory path '${globalTemplatePath}' does not exist.`
      );
    }
    try {
      return open(globalTemplatePath);
    } catch (e) {
      showError(`Could not open directory`);
      return null;
    }
  }
};
