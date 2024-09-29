import * as vscode from 'vscode';
import { FileSettings, TemplateNotation } from '../types';

import {
  createDirectory,
  writeToFile,
  fileExists,
  getFileContent,
  isDirectory,
} from '../lib/fsHelpers';
import { applyInstruction, extractPreciseContentBetweenTags, parseInstruction, replaceAllVariablesInString, replaceLineWraps } from '../lib/stringHelpers';
import { dirname } from 'path';
import { minimatch } from 'minimatch';
type PreciseInstruction = {
  after?: string
  before?: string
  content: string
}
export default (templateNotation: TemplateNotation, ignoreFiles: string[]) =>
  async (file: FileSettings) => {
    if (file.template === 'EmptyDirectory') {
      createDirectory(file.fileName);
      return null;
    }

    if (fileExists(file)) {
      if (file.template?.includes('__precisecontent__')) {
        try {
          let resultingContent = getFileContent(file.fileName) || '';
          const templateInstructions = extractPreciseContentBetweenTags(`${file.template}`)
            .map(parseInstruction);

            templateInstructions.forEach(instruction => resultingContent = applyInstruction(resultingContent, instruction));
          writeToFile(
            file.fileName,
            resultingContent
          );
        } catch (e) {
          console.error(e);
        }
      } else
      if (file.template?.includes('__existingcontent__')) {
        const currentFileContent = getFileContent(file.fileName);
        const rawReplacedContent = replaceAllVariablesInString(
          file.template as string,
          [['__existingcontent__', currentFileContent || '']],
          templateNotation
        );
        writeToFile(
          file.fileName,
          rawReplacedContent
        );
      } else {
        writeToFile(file.fileName, file.template as string);
      }
    } else {
      if (!isDirectory(dirname(file.fileName))) {
        createDirectory(dirname(file.fileName));
      }
      if (!ignoreFiles.some((pattern) => minimatch(file.fileName, pattern))) {
        writeToFile(file.fileName, file.template as string);
      }
    }

    if (file.template) {
      return { filePath: file.fileName, isExecutable: file.isExecutable };
    }
    return { isExecutable: file.isExecutable };
  };
