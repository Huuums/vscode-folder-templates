import * as vscode from 'vscode';
import createFileOrDirectory from '../actions/createFileOrDirectory';
import { FileSettings, TemplateNotation } from '../types';

const createStructure = async (
  structure: FileSettings[] | undefined,
  templateNotation: TemplateNotation,
  ignoreFiles: string[]
) => {
  if (structure) {
    const fileUris = await Promise.all(
      structure.map(createFileOrDirectory(templateNotation, ignoreFiles))
    );

    return fileUris;
  }
};

export default createStructure;
