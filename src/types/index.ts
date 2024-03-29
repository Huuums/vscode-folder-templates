export interface FolderTemplateConfig {
  name?: string;
  customVariables?: string[];
  omitParentDirectory?: boolean;
  absolutePath?: boolean;
  omitFTName?: boolean;
  overwriteExistingFiles?: 'never' | 'always' | 'prompt';
  openFilesWhenDone?: string[];
  templateNotation: TemplateNotation;
  setExecutablePermission?: boolean;
  ignoreFiles?: string[];
}

export type TemplateNotation = {
  start: string[];
  end: string[];
};
export interface FolderTemplate extends FolderTemplateConfig {
  name: string;
  structure: FolderStructure;
}

export type FolderStructure = FileSettings[];

export type FileSettings = {
  fileName: string;
  template?: string | string[];
  isExecutable: boolean;
};

export type FolderContent = {
  filePath: string;
  content: string | null;
};

export type FileTemplateCollection = Record<string, FileTemplate>;

export type FileTemplate = string[] | string;

export type StringReplaceTuple = [string, string];
