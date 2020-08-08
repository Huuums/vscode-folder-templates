export type FolderStructure = {
  name: string;
  customVariables: string[];
  structure: FolderStructureFile[];
};

export type FolderStructureFile = {
  fileName: string;
  template?: string;
};
export type FolderContent = {
  filePath: string;
  content: string | null;
};

export type TemplateCollection = Record<string, Template>;

export type Template = string[] | string;

export type FileQuickPickItem = {
  content: string;
  label: string;
  picked: boolean;
  description: string;
  filePath: string;
};
