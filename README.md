# VS-Code Fast Folder Structure - What is this and why

VS-Code Fast Folder Structure is an extension which creates your folders/files just like you defined in your templates.

FFS (yes, this acronym is not by chance) is what I kept thinking when I had to create 2 folders 4-5 files for every component I wrote. But I didn't want this anymore. And if you feel the same, this might just be the extension for you.

## Features

- Create your own Templates for your folder structures and files and then let the extension do the rest.
- No more annoyance by having to create 2 files or more for every single component.

![demo](images/demo.gif)

## Extension

### The value \<FFSName\> will always be replaced into the componentname you specified in the InputPrompt in both your Templates as well your filenames

This extension contributes the following settings:

- `fastFolderStructure.structures`: Takes an `Array` of `objects` in this format

```json
{ "fastFolderStructure.structures": [
  {
    "name": "Your name for the folder structure",
    "structure": [
      {
      "name": "<FFSName>.jsx",
      "template": "My JSX Template"  <-- This is the name of the filetemplate that you will create later on.
      },
      {
        // You can also create nested Folders like this
        "name": "firstnestedfolder/secondnestedfolder/<FFSName>.test.js",
        // Not specifying a template will simply create an empty file
      },
      {
        "name": "index.js",
        "template: "Indexfile with only import/export",
      },
      ...
    ]
  }
]}
```

- `fastFolderStructure.fileTemplates`: Takes an `Object` where the `key` is the name of the template.

  The value can either be

  - an `Array` where every item in the array is a `String`. Every new item in the array will be written into a new line.
  - a `String` and you can annotate the linebreaks yourself with `\n`.

```json
{
  "fastFolderStructure.fileTemplates": {
    "My JSX Template": [
      "import React from 'react';",
      "",
      "interface <FFSName>Props {",
      "}",
      "",
      "const <FFSName> = (props) => {",
      "  return <div/>;",
      "};",
      "",
      "export default <FFSName>;"
    ],
    "Indexfile with only import/export": [
      "import <FFSName> from './<FFSName>'\n\nexport default <FFSName>;"
    ]
  }
}
```

## Known Issues

- Creating files via this extension that already exist will override the existing files.

- No tests yet, I like to live dangerously.
- Not really an issue but I'd appreciate feedback in improvements or how to make templating the files easier.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of vscode-FFS
