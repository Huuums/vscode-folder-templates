import * as vscode from 'vscode';
import { FileSettings, TemplateNotation } from '../types';

import {
  createDirectory,
  writeToFile,
  fileExists,
  getFileContent,
  isDirectory,
} from '../lib/fsHelpers';
import { replaceAllVariablesInString } from '../lib/stringHelpers';
import { dirname } from 'path';
import { minimatch } from 'minimatch';

export default (templateNotation: TemplateNotation, ignoreFiles: string[]) =>
  async (file: FileSettings) => {
    if (file.template === 'EmptyDirectory') {
      createDirectory(file.fileName);
      return null;
    }

    if (fileExists(file)) {
      if (file.template?.includes('__existingcontent__')) {
        const currentFileContent = getFileContent(file.fileName);
        writeToFile(
          file.fileName,
          replaceAllVariablesInString(
            file.template as string,
            [['__existingcontent__', currentFileContent || '']],
            templateNotation
          )
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
