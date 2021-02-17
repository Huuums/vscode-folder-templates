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

const transform = (replacement: string, transformer: string) => match(transformer)
  .caseEqual('lowerCase', replacement.toLowerCase())
  .caseEqual('upperCase', replacement.toUpperCase())
  .caseEqual('camelCase', camelCase(replacement))
  .caseEqual('capitalCase', capitalCase(replacement))
  .caseEqual('constantCase', constantCase(replacement))
  .caseEqual('dotCase', dotCase(replacement))
  .caseEqual('headerCase', headerCase(replacement))
  .caseEqual('noCase', noCase(replacement))
  .caseEqual('paramCase', paramCase(replacement))
  .caseEqual('pascalCase', pascalCase(replacement))
  .caseEqual('pathCase', pathCase(replacement))
  .caseEqual('sentenceCase', sentenceCase(replacement))
  .caseEqual('snakeCase', snakeCase(replacement))
  .caseEqual('singular', singular(replacement))
  .caseEqual('plural', plural(replacement))
  .default(replacement);

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
