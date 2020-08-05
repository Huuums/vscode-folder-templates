import { Template } from './types';

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
    case 'kebabcase':
      return toKebabCase(replacement);
    case 'snakecase':
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
    .replace(/([a-z])([A-Z])/g, '$1-$2')    // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, '-')                // replace all spaces and low dashes
    .toLowerCase();                         // convert to lower case


const toSnakeCase = (str: String) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1_$2')    // get all lowercase letters that are near to uppercase ones
    .replace(/[\s\-]+/g, '_')                // replace all spaces and low dashes
    .toLowerCase();                         // convert to lower case

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

export {
  getReplaceRegexp,
  replaceText,
  convertFileContentToString,
  replaceAllVariablesInString,
};
