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
  camelCaseTransformMerge,
  pascalCaseTransformMerge
} from "change-case";
import { match } from "x-match-expression";
import { FileTemplate, TemplateNotation } from "../types";

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

const getTransformedSSFName = (replacement: string, transformer: string) => {
  return transformer
    ?.split(/(\?|\&)/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .reduce((acc, cur) => transform(acc, cur), replacement) ?? replacement;
};

const replaceFirstTransformer = (originalString:string,replaceFrom: string, replaceWith: string) => originalString.replace(replaceFrom, replaceWith);
const replaceLastTransformer = (originalString:string,replaceFrom: string, replaceWith: string) => {
  const lastIndex = originalString.lastIndexOf(replaceFrom);
  return lastIndex < 0 ? originalString : originalString.substring(0, originalString.lastIndexOf(replaceFrom)) + replaceWith;
};

const replaceTransformer = (originalString:string,replaceFrom: string, replaceWith: string) => originalString.replaceAll(replaceFrom, replaceWith);


const transform = (replacement: string, transformer: string) => {
  if(transformer.includes('replacefirst')) {
    return replaceFirstTransformer(replacement, transformer.split("'")[1], transformer.split("'")[3]);
  }
  if(transformer.includes('replacelast')) {
    return replaceLastTransformer(replacement, transformer.split("'")[1], transformer.split("'")[3]);
  }
  if(transformer.includes('replace')) {
    return replaceTransformer(replacement, transformer.split("'")[1], transformer.split("'")[3]);
  }

  return match(removeSpecialCharacters(transformer).toLowerCase())
  .caseEqual('lowercase', replacement.toLowerCase())
  .caseEqual('uppercase', replacement.toUpperCase())
  .caseEqual('camelcase', camelCase(replacement, { transform: camelCaseTransformMerge }))
  .caseEqual('capitalcase', capitalCase(replacement))
  .caseEqual('constantcase', constantCase(replacement))
  .caseEqual('dotcase', dotCase(replacement))
  .caseEqual('headercase', headerCase(replacement))
  .caseEqual('nocase', noCase(replacement))
  .caseEqual('paramcase', paramCase(replacement))
  .caseEqual('pascalcase', pascalCase(replacement, { transform: pascalCaseTransformMerge }))
  .caseEqual('pathcase', pathCase(replacement))
  .caseEqual('sentencecase', sentenceCase(replacement))
  .caseEqual('snakecase', snakeCase(replacement))
  .caseEqual('singular', singular(replacement))
  .caseEqual('plural', plural(replacement))
  .caseEqual('lowercasefirstchar', lowerCaseFirstChar(replacement))
  .caseEqual('capitalize', capitalize(replacement))
  .caseEqual('kebabcase', paramCase(replacement))
  .default(replacement);
};

const lowerCaseFirstChar = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const removeSpecialCharacters = (string: string) =>
  string.replace(/[^a-zA-Z]/g, "");

const convertFileContentToString = (content: FileTemplate | undefined) => {
  if (!content) {
    return "";
  }
  return Array.isArray(content) ? content.join("\n") : content;
};

const getReplaceRegexp = (
  variableName: string,
  templateNotation: TemplateNotation
) => {
  //finds <variableName( (| or %) transformer)> and  [variableName( (| or %) transformer)] in strings)
  const {start, end} = templateNotation;

  function escapeForRegExp(text:string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const regexpStringStart = `(?:${start.map(escapeForRegExp).join("|")})`;
  const regexpStringEnd = `(?:${end.map(escapeForRegExp).join("|")})`;

  const regexp = new RegExp(
    `${regexpStringStart}${variableName}\\s*(?:\\s*(?:\\||\\%)\\s*((?:[A-Za-z](\\?|\\&)*)*|(?:[A-Za-z]+(\\?|\\&))*replace(?:first|last)?\\('.*?',\\s*'.*?'\\)(?:(\\?|\\&)[A-Za-z]+)*)\\s*)*${regexpStringEnd}`,
    "g"
  );

  //(?:<|\[)FTName\s*(?:\s*(?:\||\%)\s*((?:[A-Za-z]\?)+|(?:[A-Za-z]+\?)*replace\(\[.*?\]\,\s*\[.*?\]\)(?:\?[A-Za-z]+)*)\s*?)*(?:>|\])

  return regexp;
};

const replaceAllVariablesInString = (
  string: string,
  replaceValues: string[][],
  templateNotation: TemplateNotation
) => {


  return replaceValues.reduce((acc, row) => {
    const [variableName, replaceValue] = row;
    return replacePlaceholder(
      acc,
      getReplaceRegexp(variableName, templateNotation),
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
