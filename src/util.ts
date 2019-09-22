import { Template } from './types';

const replaceAll = function(
  target: string,
  search: string | RegExp,
  replacement: string,
) {
  return target.replace(new RegExp(search, 'g'), match =>
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
  replaceValue: string | RegExp,
  newValue: string,
) => {
  if (!content) {
    return '';
  }
  if (Array.isArray(content)) {
    return replaceAll(content.join('\n'), replaceValue, newValue);
  }
  return replaceAll(content, replaceValue, newValue);
};

export { replaceAll, getFileContentStringAndReplacePlaceholder };

export function ensure<T>(
  argument: T | undefined | null,
  message: string = 'This value was promised to be there.',
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
