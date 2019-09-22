# VS-Code Fast Folder Structure

## What is this and why

VS-Code Fast Folder Structure is an extension which creates your folders/files as you specify in templates.

FFS (yes, this acronym is not by chance) is what I kept thinking when I had to create two folders and 4-5 files for every component I wrote. But I didn't want this anymore. And if you feel the same, this might just be the extension for you.

## Features

- Create your own Templates for folder structures and files and then let the extension do the rest.
- Spend your time actually programming and not creating files.

![demo](images/demo.gif)

## Extension

This extension contributes the following settings:

- `fastFolderStructure.structures`: Takes an `array of objects`
- `fastFolderStructure.fileTemplates`: Takes an `object` where the `key` is the name of the template.

### fastFolderStructure.structures

- `name` is the name that will be shown in the select dropdown.
- `structure` folder structure you want to create. It takes an `array of objects` where every file you want to create is its own object.
  - each file has a required `fileName` key and an optional `template` key.
  - if a template key is specified it should match a key of one of your `fileTemplates`. See [fastFolderStructure.fileTemplates](#fastFolderStructure.fileTemplates)

```json
{
  "fastFolderStructure.structures": [
  {
    "name": "Your name for the folder structure",
    "structure": [
      {
        "fileName": "<FFSName>.jsx",
        "template": "My JSX Template"
      },
      {
        "fileName": "firstnestedfolder/secondnestedfolder/<FFSName>.test.js",
      },
      {
        "fileName": "index.js",
        "template": "Indexfile with only import/export",
      },
      ...
    ]
  }
]}
```

Additional information:

- In the example above you can also see, that it's possible to create nested folders.

### fastFolderStructure.fileTemplates

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

## Templating

The value `<FFSName>` will always be replaced into the component name you specified in the input promt in both your templates as well as your filenames

Adding a transformer with this pattern `<FFSName | transformer>` will give you the ability to transform your componentname where needed.

The currently supported transformers are: `uppercase`, `lowercase` and `capitalize`. (I'm open for new suggestions any time)

Given the componentname `myNewComponent` each of the transformers will result in:

```
<FFSName | uppercase> => MYNEWCOMPONENT
<FFSName | lowercase> => mynewcomponent
<FFSName | capitalize> => MyNewComponent
```

## Known Issues

- Creating files via this extension that already exist will override existing files.

- No tests yet, I like to live dangerously.
- Not really an issue but I'd appreciate feedback in improvements or how to make templating easier. Because even I feel like it's a bother (not a big one but still) to set this up initially

## Release Notes

The VS-Code Demo readme said `Users appreciate release notes as you update your extension.`

So here are the release notes.

### 0.2.0

- Added feature to transform your FFSName to lowercase, uppercase or capitalize it.(Thanks marcocavanna!)
- Cleaned up the readme a bit

### 0.1.6

- Added feature to automatically save files that have a template assigned. No more manually saving every file.
- Moved 'Create Folder from FFS-Template' Context Item into the workspace group where it should be.

### 0.1.5

Fixed wrong information in Readme on how to use the extension. Thank you snigglewhoop for pointing that out!

### 0.1.4

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
