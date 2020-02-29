import { Template } from './types';

const replaceText = function(
  target: string,
  search: RegExp,
  replacement: string,
) {
  return target.replace(search, (_match, transformer) =>
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
    case 'uppercase':
      return replacement.toUpperCase();
    case 'capitalize':
      return capitalize(replacement);
    default:
      return replacement;
  }
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
