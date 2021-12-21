import open from "open";
import { normalize } from "path";
import { createDirectory, isDirectory } from "../lib/fsHelpers";
import { readConfig, showError } from "../lib/vscodeHelpers";

export default (defaultGlobalPath: string) => {
  const configuredPath = readConfig('globalTemplateDirectoryPath');
  if(configuredPath) {
    const normalizedPath = normalize(configuredPath);
    if(!isDirectory(normalizedPath)) {
      showError(`The configured global template directory path '${normalizedPath}' does not exist.`);
    }
    try{
      return open(normalizedPath);
    } catch(e){
      showError(`Could not open directory`);
      return null;
    }
  }


  if (!isDirectory(defaultGlobalPath)) {
    createDirectory(defaultGlobalPath);
  }

  try {
    return open(defaultGlobalPath);
  } catch (e) {
    showError(`Could not open directory`);
    return null;
  }
};