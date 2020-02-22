import { Template } from './types';

const replaceText = function(
  target: string,
  search: RegExp,
  replacement: string,
) {
  return target.replace(search, match =>
    getTransformedSSFName(match, replacement),
  );
};

const getTransformedSSFName = (match: string, replacement: string) => {
  const [, transformer] = match.split('|');
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

const getFileContentStringAndReplacePlaceholder = (
  content: Template | undefined,
  replaceValues: string[][],
) => {
  if (!content) {
    return '';
  }
  const fileContent = Array.isArray(content) ? content.join('\n') : content;

  return replaceAllVariablesInString(fileContent, replaceValues);
};

const replaceAllVariablesInString = (
  string: string,
  replaceValues: string[][],
) => {
  return replaceValues.reduce((acc, row) => {
    const [variableName, replaceValue] = row;
    return replaceText(
      acc,
      new RegExp(`<${variableName}\\s*(?:\\s*\\|\\s*([A-Za-z]+))?>`, 'g'),
      replaceValue,
    );
  }, string);
};

export {
  replaceText,
  getFileContentStringAndReplacePlaceholder,
  replaceAllVariablesInString,
};

export function ensure<T>(
  argument: T | undefined | null,
  message: string = 'This value was promised to be there.',
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
