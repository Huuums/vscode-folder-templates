export type FolderStructure = {
  name: string;
  customVariables: string[];
  structure: FolderStructureFile[];
};

export type FolderStructureFile = {
  fileName: string;
  template: string;
};

export type TemplateCollection = Record<string, Template>;

export type Template = string[] | string;
