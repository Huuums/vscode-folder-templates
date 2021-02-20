# VS-Code Folder Templates

### What is this and why

VS-Code Folder Templates is an extension which creates your folders/files as specified in custom templates.

Why? Because creating the same directories over and over again is annoying to do manually.

### Features

- Create Templates for folder structures and files and then let the extension do the rest.
- Spend your time actually programming and not creating files.

![demo](images/demo.gif)

## Templating

To create your templates you have two options.

1. Create templates on your File System
2. Go into your `settings.json` from VSCode and create templates [manually](#template-format). (Open the command palette and select "Open Settings (JSON)" to easily access your settings.json)

### Interpolation

The value `<FTName>` (or `[FTName]`) will always be interpolated into the component name you are asked for when creating the structure.
Adding a transformer with this pattern `<FTName | transformer>` (or `<FTName % transformer>`) will give you the ability to transform your componentname wherever needed.
The currently supported transformers are:

- `lowercase`
- `uppercase`
- `camelcase`
- `capitalcase`
- `constantcase`
- `dotcase`
- `headercase`
- `nocase`
- `paramcase`
- `pascalcase`
- `pathcase`
- `sentencecase`
- `snakecase`
- `singular`
- `plural`
- `lowercasefirstchar`
- `capitalize`
- `kebabcase`

It is possible to specify a set of custom Variables which will be interpolated as well. You will be asked to enter a value for every custom variable defined. They can be transformed the same way as the default `<FTName>`

Examples

| Input            | Transformer                                | Result           | Description                                                                                                     |
| ---------------- | -------------------------------------------| ---------------- | ----------------------------------------------------------------------------------------------------------------|
| LOWERCASE        | \<FTName \| lowercase\>                    | lowercase        |
| uppercase        | \<FTName \| uppercase\>                    | UPPERCASE        |
| My-new-component | \<FTName \| camelcase\>                    | myNewComponent   | (First letter is lowercased. Every letter behind a special character will be capitalized)                       |
| test string      | \<FTName \| capitalcase\>                  | Test String      |
| test string      | \<FTName \| constantcase\>                 | TEST_STRING      |
| test string      | \<FTName \| dotcase\>                      | test.string      |
| test string      | \<FTName \| headercase\>                   | Test-String      |
| test string      | \<FTName \| nocase\>                       | test string      |
| test string      | \<FTName \| paramcase\>                    | test-string      |
| my-new-component | \<FTName \| pascalcase\>                   | MyNewComponent   | (First letter and every letter behind a special character will be capitalized)                                  |
| test string      | \<FTName \| pathcase\>                     | test/string      |
| test string      | \<FTName \| sentencecase\>                 | Test string      |
| test string      | \<FTName \| snakecase\>                    | test_string      |
| boxes            | \<FTName \| singular\>                     | box              |
| box              | \<FTName \| plural\>                       | boxes            |
| wooden box       | \<FTName \| plural?snakecase?uppercase\>   | WOODEN_BOXES     | it is possible to combine transformations with the "?" operator, these will be performed from left to right.    |
| MyNewComponent   | \<FTName \| lowercasefirstchar\>           | myNewComponent   |
| myNewComponent   | \<FTName \| capitalize\>                   | MyNewComponent   | just like capitalcase
| myNewComponent   | \<FTName \| kebabcase\>                    | my-new-component | just like paramcase

### Thanks to the change-case and pluralize libraries, for the transformations

- https://github.com/blakeembrey/change-case
- https://www.npmjs.com/package/pluralize

## Creating templates on the File System

You can either create a `.fttemplates` folder in your project root and save all templates you want to access in this project there or use the global `.fttemplates` folder that exists in the directory of this extension. (Use the `Open Global Folder Templates Directory` command in the command palette to get there quickly)

Create a folder with files and folders inside it and put in the placeholders wherever you need them. That's it. You created your template. It works out of the box but if you need some special settings for a template you can create a `.ftsettings.json` file inside your template folder.

See more in the [examples](https://github.com/Huuums/vscode-folder-templates/tree/master/examples)

### Available .ftsettings.json Properties

| Key                 | Type                                         | Description                                                                                                                                 |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| name                | string (default: Name of the parent Folder ) | Name of the Folder Template                                                                                                                 |
| customVariables     | string[] `variableName=>defaultvalue`        | Custom variables that will be replaced upon folder creation                                                                                 |
| omitParentDirectory | boolean (default: false)                     | If set to true FT will create all files directly inside the current folder instead of creating a new folder and all the files inside of it. |
| omitFTName          | boolean (default: false)                     | If set to true FT will not ask for a component name. (Can only be set to true if omitParentDirectory is true as well)                       |

## Creating your Template in VS Code settings.json

There are two key parts to creating your FT Templates. [Folder Structures](#folderTemplates.structures) and [File Templates](#folderTemplates.fileTemplates).

### folderTemplates.structures

The `folderTemplates.structures` option takes an `array of objects` where one object equals one Folder Structure.

Example Structure

```json
{
  "name": "My Custom Template",
  "customVariables": ["CustomVar", "CustomVar2"],
  "omitParentDirectory": true,
  "structure": [
    {
      "fileName": "<FTName>.jsx",
      "template": "Typescript Functional Component"
    },
    {
      "fileName": "tests/<FTName>.test.js"
    },
    {
      "fileName": "index.js",
      "template": "IndexFile"
    },
    {
      "fileName": "<CustomVar>",
      "template": "EmptyDirectory"
    }
  ]
}
```

| Key                 | Type                                    | Description                                                                                                                                 |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| name                | string                                  | Name of the Folder Template.                                                                                                                |
| customVariables     | string[]                                | Custom variables that will be replaced upon folder creation "variableName=>defaultvalue"                                                    |
| structure           | {fileName: string, template?: string}[] | Every object in this array represents a File or Folder that will be created                                                                 |
| omitParentDirectory | boolean (default: false)                | If set to true FT will create all files directly inside the current folder instead of creating a new folder and all the files inside of it. |
| omitFTName          | boolean (default: false)                | If set to true FT will not ask for a component name. (Can only be set to true if omitParentDirectory is true as well)                       |

If a template is specified for a file its value should match one of the names of your [folderTemplates.fileTemplates](#folderTemplates.fileTemplates) or have the `EmptyDirectory` value. If the template value is `EmptyDirectory` it will create an empty directory instead of a file.

### folderTemplates.fileTemplates

- The `key` of the `key-value` pair is the name of the template
- The value can either be
  - an `array` where every item in the array is a `string`. Every new item in the array will be written into a new line.
  - a `string` and you can annotate the linebreaks yourself with `\n`.

Two example filetemplates

```json
{
  "folderTemplates.fileTemplates": {
    "Typescript Functional Component": [
      "import React from 'react';",
      "",
      "interface <FTName>Props {",
      "}",
      "",
      "const <FTName> = (props) => {",
      "  return <div/>;",
      "};",
      "",
      "export default <FTName>;"
    ],
    "Indexfile": "import <FTName> from './<FTName>'\n\nexport default <FTName>;"
  }
}
```

### Using the command createFolderStructure with a keybind

You can add a `string` argument to the keybind you are using to define a static folder in which you want the new folder to be created.

```json
{
  "key": "ctrl+0", //or your preffered keybind,
  "command": "FT.createFolderStructure",
  "args": "src/components"
}
```

If you put the argument `"__current"` it will create the folder **next** to the file that is currently open in the editor.

## Migrating to 3.0

The name of the extension was changed which resulted in some placeholders and the config namespace being changed.

- The `FFSName` Placeholder no longer works. Please replace it with the new placeholder `FTName`
- Please switch the configuration keys from `fastFolderStructure.structures` to `folderTemplates.structures` and `fastFolderStructure.fileTemplates` to `folderTemplates.fileTemplates`.
- Calling the `FFS.createFolderStructure` command will no longer work. Please replace it with `FT.createFolderStructure`

### Credits

The idea for FT came after seeing this extension [ee92.folderize](https://marketplace.visualstudio.com/items?itemName=ee92.folderize)
