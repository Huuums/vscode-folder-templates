# VS-Code Fast Folder Structure - What is this and why

VS-Code Fast Folder Structure is an extension which creates your folders/files as you specify in templates.

FFS (yes, this acronym is not by chance) is what I kept thinking when I had to create two folders and 4-5 files for every component I wrote. But I didn't want this anymore. And if you feel the same, this might just be the extension for you.

## Features

- Create your own Templates for folder structures and files and then let the extension do the rest.
- Spend your time actually programming and not creating files.

![demo](images/demo.gif)

## Extension

This extension contributes the following settings:

### The value \<FFSName\> will always be replaced into the component name you specified in the input promt in both your templates as well as your filenames

- `fastFolderStructure.structures`: Takes an `Array` of `objects`
- `fastFolderStructure.fileTemplates`: Takes an `Object` where the `key` is the name of the template.

## fastFolderStructure.structures

```json
{
  "fastFolderStructure.structures": [
  {
    "name": "Your name for the folder structure",
    "structure": [
      {
        "name": "<FFSName>.jsx",
        "template": "My JSX Template"
      },
      {
        "name": "firstnestedfolder/secondnestedfolder/<FFSName>.test.js",
      },
      {
        "name": "index.js",
        "template": "Indexfile with only import/export",
      },
      ...
    ]
  }
]}
```

Additional information:

- In the example above you can also see, that it's possible to created nested folders.
- You don't need to specify a template, if no template is specified the file will be created empty

## fastFolderStructure.fileTemplates

- The `key` of the `key->value` pair is the name of the template

- The value can either be
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

- Creating files via this extension that already exist will override existing files.

- No tests yet, I like to live dangerously.
- Not really an issue but I'd appreciate feedback in improvements or how to make templating easier. Because even I feel like it's a bother (not a big one but still) to set this up initially

## Release Notes

The VS-Code Demo readme said `Users appreciate release notes as you update your extension.`

So here are the release notes.

### 0.1.3

I forgot to test some stuff and broke the whole thing. It's working again.

### 0.1.2

Added info where this idea came from.

### 0.1.1

Fixed readme stuff

### 0.1.0

This is the super beta so people can't shout at me when something doesn't work.

You're glad you had those release notes, eh?

### Credits

The idea for FFS came after seeing this extension [ee92.folderize](https://marketplace.visualstudio.com/items?itemName=ee92.folderize)
