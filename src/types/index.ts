export interface FolderTemplateConfig {
  name?: string;
  customVariables?: string[];
  omitParentDirectory?: boolean;
  omitFTName?: boolean;
  overwriteExistingFiles?: 'never' | 'always' | 'prompt';
}

export interface FolderTemplate extends FolderTemplateConfig {
  name: string;
  structure: FolderStructure;
}

export type FolderStructure = FileSettings[];

export type FileSettings = {
  fileName: string;
  template?: string | string[];
};

export type FolderContent = {
  filePath: string;
  content: string | null;
};

export type FileTemplateCollection = Record<string, FileTemplate>;

export type FileTemplate = string[] | string;

export type StringReplaceTuple = [string, string];
