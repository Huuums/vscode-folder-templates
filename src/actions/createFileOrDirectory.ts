import * as vscode from 'vscode';
import { FileSettings, TemplateNotation } from '../types';

import {
  createDirectory,
  writeToFile,
  fileExists,
  getFileContent,
} from '../lib/fsHelpers';
import { replaceAllVariablesInString } from '../lib/stringHelpers';
import { dirname } from 'path';

export default (templateNotation: TemplateNotation) =>
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
      createDirectory(dirname(file.fileName));
      writeToFile(file.fileName, file.template as string);
    }

    if (file.template) {
      return { filePath: file.fileName, isExecutable: file.isExecutable };
    }
    return { isExecutable: file.isExecutable };
  };
