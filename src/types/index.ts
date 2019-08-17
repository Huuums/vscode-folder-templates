export type FolderStructure = {
  name: string;
  structure: FolderStructureFile[];
};

export type FolderStructureFile = {
  fileName: string;
  template: string;
};

export type TemplateCollection = {
  [key: string]: Template;
};

export type Template = string[] | string;
