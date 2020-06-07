import { Template, FolderContent } from './types';
import * as vscode from 'vscode';
import { readdirSync, readFileSync, PathLike } from 'fs';
import { normalize } from 'path';

const replaceText = function (
  target: string,
  stringToReplace: RegExp,
  replacement: string,
) {
  return target.replace(stringToReplace, (_, transformer) =>
    //only need the transformer
    getTransformedSSFName(replacement, transformer),
  );
};

const getTransformedSSFName = (replacement: string, transformer: string) => {
  if (!transformer) {
    return replacement;
  }
  switch (removeSpecialCharacters(transformer).toLowerCase()) {
    case 'lowercase':
      return replacement.toLowerCase();
    case 'lowercasefirstchar':
      return lowerCaseFirstChar(replacement);
    case 'uppercase':
      return replacement.toUpperCase();
    case 'capitalize':
      return capitalize(replacement);
    case 'pascalcase':
      return toCamelCase(capitalize(replacement));
    case 'camelcase':
      return toCamelCase(lowerCaseFirstChar(replacement));
    default:
      return replacement;
  }
};

const toCamelCase = (str: String) =>
  str.replace(/[^A-Za-z0-9]+(.)/g, (_, charAfterSpecialChars) => {
    return charAfterSpecialChars.toUpperCase();
  });

const lowerCaseFirstChar = (string: String) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const removeSpecialCharacters = (string: string) =>
  string.replace(/[^a-zA-Z]/g, '');

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const convertFileContentToString = (content: Template | undefined) => {
  if (!content) {
    return '';
  }
  return Array.isArray(content) ? content.join('\n') : content;
};

const getReplaceRegexp = (variableName: string) => {
  const regexp = new RegExp(
    `<${variableName}\\s*(?:\\s*\\|\\s*([A-Za-z]+))?>`,
    'g',
  );
  return regexp;
};

const replaceAllVariablesInString = (
  string: string,
  replaceValues: string[][],
) => {
  return replaceValues.reduce((acc, row) => {
    const [variableName, replaceValue] = row;
    return replaceText(acc, getReplaceRegexp(variableName), replaceValue);
  }, string);
};

const getFileContent = (path: PathLike) => {
  try {
    let fileContent = readFileSync(path, { encoding: 'utf8' });
    return fileContent;
  } catch (e) {
    return null;
  }
};

const getFolderContents = (
  uri: vscode.Uri,
  workspacePath?: string,
): FolderContent[] | undefined => {
  try {
    const files = readdirSync(uri.fsPath, { withFileTypes: true });
    const allPaths = files.map((file) => {
      if (file.isDirectory()) {
        return getFolderContents(vscode.Uri.joinPath(uri, file.name));
      }
      return {
        filePath: vscode.Uri.joinPath(uri, file.name).fsPath,
        content: getFileContent(`${uri.fsPath}/${file.name}`),
      };
    });
    if (allPaths.length === 0) {
      return [
        {
          filePath: uri.fsPath,
          content: 'EmptyDirectory',
        },
      ];
    }
    return allPaths.flat();
  } catch (e) {
    vscode.window.showErrorMessage(
      'Something went wrong getting Folder contents',
    );
  }
};

export {
  getFolderContents,
  getReplaceRegexp,
  replaceText,
  convertFileContentToString,
  replaceAllVariablesInString,
};
