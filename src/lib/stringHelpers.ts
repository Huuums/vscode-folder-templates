import { plural, singular } from 'pluralize';
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
  pascalCaseTransformMerge,
} from 'change-case';
import { match } from 'x-match-expression';
import { FileTemplate, TemplateNotation } from '../types';
import { formatInTimeZone } from 'date-fns-tz';

const replacePlaceholder = function (
  target: string,
  stringToReplace: RegExp,
  replacement: string
) {
  return target.replace(stringToReplace, (val, transformer, ...rest) => {
    //only need the transformer
    if (val.includes('DATE_NOW')) {
      const { dateformat, datetype } = rest[rest.length - 1];
      if (dateformat && datetype) {
        return formatInTimeZone(
          new Date(),
          datetype === 'DATE_NOW_UTC'
            ? 'UTC'
            : Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateformat
        );
      }
    }
    return getTransformedSSFName(replacement, transformer);
  });
};

const getTransformedSSFName = (replacement: string, transformer: string) => {
  return (
    transformer
      ?.split(/(\?|&)/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .reduce((acc, cur) => transform(acc, cur), replacement) ?? replacement
  );
};

const replaceFirstTransformer = (
  originalString: string,
  replaceFrom: string,
  replaceWith: string
) => originalString.replace(replaceFrom, replaceWith);
const replaceLastTransformer = (
  originalString: string,
  replaceFrom: string,
  replaceWith: string
) => {
  const lastIndex = originalString.lastIndexOf(replaceFrom);
  return lastIndex < 0
    ? originalString
    : originalString.substring(0, originalString.lastIndexOf(replaceFrom)) +
        replaceWith;
};

const replaceTransformer = (
  originalString: string,
  replaceFrom: string,
  replaceWith: string
) => originalString.replaceAll(replaceFrom, replaceWith);

const transform = (replacement: string, transformer: string) => {
  if (transformer.includes('replacefirst')) {
    return replaceFirstTransformer(
      replacement,
      transformer.split("'")[1],
      transformer.split("'")[3]
    );
  }
  if (transformer.includes('replacelast')) {
    return replaceLastTransformer(
      replacement,
      transformer.split("'")[1],
      transformer.split("'")[3]
    );
  }
  if (transformer.includes('replace')) {
    return replaceTransformer(
      replacement,
      transformer.split("'")[1],
      transformer.split("'")[3]
    );
  }

  return match(removeSpecialCharacters(transformer).toLowerCase())
    .caseEqual('lowercase', replacement.toLowerCase())
    .caseEqual('uppercase', replacement.toUpperCase())
    .caseEqual(
      'camelcase',
      camelCase(replacement, { transform: camelCaseTransformMerge })
    )
    .caseEqual('capitalcase', capitalCase(replacement))
    .caseEqual('constantcase', constantCase(replacement))
    .caseEqual('dotcase', dotCase(replacement))
    .caseEqual('headercase', headerCase(replacement))
    .caseEqual('nocase', noCase(replacement))
    .caseEqual('paramcase', paramCase(replacement))
    .caseEqual(
      'pascalcase',
      pascalCase(replacement, { transform: pascalCaseTransformMerge })
    )
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
  string.replace(/[^a-zA-Z]/g, '');

const convertFileContentToString = (content: FileTemplate | undefined) => {
  if (!content) {
    return '';
  }
  return Array.isArray(content) ? content.join('\n') : content;
};

const getReplaceRegexp = (
  variableName: string,
  templateNotation: TemplateNotation
) => {
  //finds <variableName( (| or %) transformer)> and  [variableName( (| or %) transformer)] in strings)
  const { start, end } = templateNotation;

  function escapeForRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  const regexpStringStart = `(?:${start.map(escapeForRegExp).join('|')})`;
  const regexpStringEnd = `(?:${end.map(escapeForRegExp).join('|')})`;
  const transformerregexpstring =
    "(?:\\s*[|%]\\s*(?<transformer>(?:[A-Za-z][?&]*)*|(?:[A-Za-z]+[?&])*replace(?:first|last)?\\('.*?',\\s*'.*?'\\)([?&][A-Za-z]+)*)\\s*)*";
  const dateRegexpString =
    "(?<datetype>DATE_NOW(?:_UTC)*)\\('(?<dateformat>.*?)'\\)*";

  //Chat GPT is the lord of regex
  const regexp = new RegExp(
    `${regexpStringStart}(?:${variableName}\\s*${transformerregexpstring}|${dateRegexpString})${regexpStringEnd}`,
    'g'
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

const extractPreciseContentBetweenTags = (input: string): string[] => {
  const regex = /\[__precisecontent__\](.*?)\[__endprecisecontent__\]/gs;
  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    // `match[1]` contains the content between the tags
    matches.push(match[1].trim());
  }

  return matches;
};

const parseInstruction = (input: string): { [key: string]: string } => {
  const lines = input.split('\r\n'); // Split by newlines
  const firstLineMatch = lines[0].match(/^(before|after):\s*(.+)$/);

  if (!firstLineMatch) {
    throw new Error("First line must start with 'before:' or 'after:'");
  }

  const key = firstLineMatch[1]; // 'before' or 'after'
  const value = firstLineMatch[2]; // The string after 'before:' or 'after:'

  // Join the remaining lines as the content
  const content = lines.slice(1).join('\r\n');

  return {
    [key]: value.trim(),
    content: content
  };
};

function applyInstruction(input: string | null, instruction: { [key: string]: string }): string {
  if (!input) {

    return '';
    // throw new Error("Input is empty");
  }
  const lines = input.split('\r\n'); // Split the input into lines
  const key = Object.keys(instruction).find(k => k === 'before' || k === 'after');

  if (!key) {
    throw new Error("Instruction must contain either 'before' or 'after' key");
  }

  const targetLine = instruction[key]; // Line we need to match
  const contentToInsert = instruction.content; // Content to insert

  let foundIndex = -1;

  // Find the line index that matches the targetLine
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(targetLine)) {
      foundIndex = i;
      break;
    }
  }
  // Split the content to insert into separate lines (if it's multiline content)
  const contentLines = contentToInsert.split('\r\n');

  // Insert content based on the key (before or after)
  // if (key === 'before') {
  //   lines.splice(foundIndex, 0, ...contentLines); // Insert before the matching line
  // } else if (key === 'after') {
  //   lines.splice(foundIndex + 1, 0, ...contentLines); // Insert after the matching line
  // }
  // Rebuild the final string based on whether we insert before or after
  let result: string[] = [];

  if (key === 'before') {
    // Insert content before the matching line
    result = [...lines.slice(0, foundIndex), ...contentLines, ...lines.slice(foundIndex)];
  } else if (key === 'after') {
    // Insert content after the matching line
    result = [...lines.slice(0, foundIndex + 1), ...contentLines, ...lines.slice(foundIndex + 1)];
  }
  // Join the lines back together and return the resulting string
  return result.join('\r\n');
}

const replaceLineWraps = (s: string) => s.replaceAll('\\r', '').replaceAll('\\n', '');
export {
  replaceLineWraps,
  getReplaceRegexp,
  replacePlaceholder,
  convertFileContentToString,
  replaceAllVariablesInString,
  extractPreciseContentBetweenTags,
  parseInstruction,
  applyInstruction
};
