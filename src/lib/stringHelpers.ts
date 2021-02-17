import { plural, singular } from "pluralize";
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from "change-case";
import { match } from "x-match-expression";
import { FileTemplate } from "../types";

const replacePlaceholder = function (
  target: string,
  stringToReplace: RegExp,
  replacement: string
) {
  return target.replace(stringToReplace, (_, transformer) =>
    //only need the transformer
    getTransformedSSFName(replacement, transformer)
  );
};

const getTransformedSSFName = (replacement: string, transformer: string) =>
  transformer
    ?.split('?')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .reduce((acc, cur) => transform(acc, cur), replacement) ?? replacement;

const transform = (replacement: string, transformer: string) => match(removeSpecialCharacters(transformer).toLowerCase())
  .caseEqual('lowercase', replacement.toLowerCase())
  .caseEqual('uppercase', replacement.toUpperCase())
  .caseEqual('camelcase', camelCase(replacement))
  .caseEqual('capitalcase', capitalCase(replacement))
  .caseEqual('constantcase', constantCase(replacement))
  .caseEqual('dotcase', dotCase(replacement))
  .caseEqual('headercase', headerCase(replacement))
  .caseEqual('nocase', noCase(replacement))
  .caseEqual('paramcase', paramCase(replacement))
  .caseEqual('pascalcase', pascalCase(replacement))
  .caseEqual('pathcase', pathCase(replacement))
  .caseEqual('sentencecase', sentenceCase(replacement))
  .caseEqual('snakecase', snakeCase(replacement))
  .caseEqual('singular', singular(replacement))
  .caseEqual('plural', plural(replacement))
  .caseEqual('lowercasefirstchar', lowerCaseFirstChar(replacement))
  .caseEqual('capitalize', capitalCase(replacement))
  .caseEqual('kebabcase', paramCase(replacement))
  .default(replacement);

const lowerCaseFirstChar = (string: String) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const removeSpecialCharacters = (string: string) =>
  string.replace(/[^a-zA-Z]/g, "");

const convertFileContentToString = (content: FileTemplate | undefined) => {
  if (!content) {
    return "";
  }
  return Array.isArray(content) ? content.join("\n") : content;
};

const getReplaceRegexp = (variableName: string) => {
  //finds <variableName( (| or %) transformer)> and  [variableName( (| or %) transformer)] in strings
  const regexp = new RegExp(
    `(?:<|\\[)${variableName}\\s*(?:\\s*(?:\\||\\%)\\s*([A-Za-z\?]+)\\s*?)?(?:>|\\])`,
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
    return replacePlaceholder(
      acc,
      getReplaceRegexp(variableName),
      replaceValue
    );
  }, string);
};

export {
  getReplaceRegexp,
  replacePlaceholder,
  convertFileContentToString,
  replaceAllVariablesInString,
};
