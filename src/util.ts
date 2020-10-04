import { Template, FolderContent, FileQuickPickItem } from "./types";
import * as vscode from "vscode";
import { readdirSync, readFileSync, PathLike } from "fs";

const replaceText = function (
  target: string,
  stringToReplace: RegExp,
  replacement: string
) {
  return target.replace(stringToReplace, (_, transformer) =>
    //only need the transformer
    getTransformedSSFName(replacement, transformer)
  );
};

const getTransformedSSFName = (replacement: string, transformer: string) => {
  if (!transformer) {
    return replacement;
  }
  switch (removeSpecialCharacters(transformer).toLowerCase()) {
    case "lowercase":
      return replacement.toLowerCase();
    case "lowercasefirstchar":
      return lowerCaseFirstChar(replacement);
    case "uppercase":
      return replacement.toUpperCase();
    case "capitalize":
      return capitalize(replacement);
    case "pascalcase":
      return toCamelCase(capitalize(replacement));
    case "camelcase":
      return toCamelCase(lowerCaseFirstChar(replacement));
    case "kebabcase":
      return toKebabCase(replacement);
    case "snakecase":
      return toSnakeCase(replacement);
    default:
      return replacement;
  }
};

const toCamelCase = (str: String) =>
  str.replace(/[^A-Za-z0-9]+(.)/g, (_, charAfterSpecialChars) => {
    return charAfterSpecialChars.toUpperCase();
  });

const toKebabCase = (str: String) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, "-") // replace all spaces and low dashes
    .toLowerCase(); // convert to lower case

const toSnakeCase = (str: String) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1_$2") // get all lowercase letters that are near to uppercase ones
    .replace(/[\s\-]+/g, "_") // replace all spaces and low dashes
    .toLowerCase(); // convert to lower case

const lowerCaseFirstChar = (string: String) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const removeSpecialCharacters = (string: string) =>
  string.replace(/[^a-zA-Z]/g, "");

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const convertFileContentToString = (content: Template | undefined) => {
  if (!content) {
    return "";
  }
  return Array.isArray(content) ? content.join("\n") : content;
};

const getReplaceRegexp = (variableName: string) => {
  //finds <variableName( | transformer)> and  [variableName( | transformer)] in strings
  const regexp = new RegExp(
    `(?:<|\\[)${variableName}\\s*(?:\\s*\\|\\s*([A-Za-z]+)\\s*?)?(?:>|\\])`,
    "g"
  );
  return regexp;
};

const replaceAllVariablesInString = (
  string: string,
  replaceValues: string[][]
) => {
  return replaceValues.reduce((acc, row) => {
    const [variableName, replaceValue] = row;
    return replaceText(acc, getReplaceRegexp(variableName), replaceValue);
  }, string);
};

const getFileContent = (path: PathLike) => {
  try {
    let fileContent = readFileSync(path, { encoding: "utf8" });
    return fileContent;
  } catch (e) {
    return null;
  }
};

const getFolderContents = (uri: vscode.Uri): FolderContent[] => {
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

const shouldCreateTemplateFromFile = (
  templateFiles: FileQuickPickItem[] | undefined,
  filePath: string
) => templateFiles?.some((file) => file.filePath === filePath);

const removeEmptyDirectories = (items: FileQuickPickItem[]) =>
  items.filter((file) =>
    Boolean(file.content && file.content !== "EmptyDirectory")
  );

const getPossibleFFSTemplateVariables = (
  templateFiles: FileQuickPickItem[] | undefined
) => (row: FileQuickPickItem) => {
  {
    //using the g flag makes the regexp stateful so you would either have to set the lastindex to 0 for it to be usable multiple times or create the regexp twice.
    const getAllPossibleStringTemplates = /(?:<|\[)(.*?)(?:\s*\|.*?)?(?:>|\])/g;

    const filepathtemplatestrings = [
      ...(row.filePath.matchAll(getAllPossibleStringTemplates) || []),
    ];

    if (shouldCreateTemplateFromFile(templateFiles, row.filePath)) {
      const filecontenttemplatestrings = [
        ...(row.content.matchAll(getAllPossibleStringTemplates) || []),
      ];
      // console.log(filecontenttemplatestrings, filepathtemplatestrings);
      return [
        ...filecontenttemplatestrings,
        ...filepathtemplatestrings,
      ].flatMap((row) => row.slice(1)); //gets value of first group
    }

    return filepathtemplatestrings.flatMap((row) => row.slice(1)); //gets value of first group
  }
};

const unique = <T>(acc: T[], row: T) =>
  acc.includes(row) ? acc : [...acc, row];

export {
  unique,
  getFolderContents,
  getReplaceRegexp,
  replaceText,
  convertFileContentToString,
  replaceAllVariablesInString,
  removeEmptyDirectories,
  shouldCreateTemplateFromFile,
  getPossibleFFSTemplateVariables,
};
