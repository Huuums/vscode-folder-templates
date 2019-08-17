import { Template } from './types';

const replaceAll = function(
  target: string,
  search: string,
  replacement: string,
) {
  return target.replace(new RegExp(search, 'g'), replacement);
};

const getFileContentStringAndReplacePlaceholder = (
  content: Template | undefined,
  replaceValue: string,
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
