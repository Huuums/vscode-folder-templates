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
- `customVariables` takes an `array of strings` with which you can define custom Variables for which you will be prompted upon creating a structure.
  - You will have to annotate your customVariables with `< >` and can also be transformed .
- `structure` folder structure you want to create. It takes an `array of objects` where every file you want to create is its own object.
  - each file has a required `fileName` key and an optional `template` key.
  - if a template key is specified it should match a key of one of your `fileTemplates`. See [fastFolderStructure.fileTemplates](#fastFolderStructure.fileTemplates)

#### Special cases

As of now there is a special keyword for the `template` key.

- EmptyDirectory (This will simply create an empty directory instead of a file).

```json
{
  "fastFolderStructure.structures": [
  {
    "name": "Your name for the folder structure",
    "customVariables": ["CustomVar", "CustomVar2"],
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
      {
        "fileName": "My Empty Directory",
        "template": "EmptyDirectory"
      }
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

The value `<FFSName>` will always be replaced into the component name you specified in the input prompt in both your templates as well as your filenames

Adding a transformer with this pattern `<FFSName | transformer>` will give you the ability to transform your componentname where needed.

The currently supported transformers are: `uppercase`, `lowercase` and `capitalize`. (I'm open for new suggestions any time)

Given the componentname `myNewComponent` each of the transformers will result in:

```
myNewComponent => <FFSName | uppercase> => MYNEWCOMPONENT
myNewComponent => <FFSName | lowercase> => mynewcomponent
myNewComponent => <FFSName | capitalize> => MyNewComponent
my-new-component => <FFSName | camelcase> => myNewComponent (every letter behind a special character will be capitalized)
my-new-component => <FFSName | pascalcase> => MyNewComponent (the very first letter and every letter behind a special character will be capitalized)
```

### Custom Variables

As of version 0.4 you can also specify custom variables. You will be prompted for every custom variable defined in your [fastFolderStructure.structures](#fastFolderStructure.structures) `structure.customVariables` property separately. These custom variables can be transformed the same way as the default `<FFSName>`

```
<customVar | uppercase> => CUSTOMVARIABLEVALUE
```

## Known Issues

- Not really an issue but I'd appreciate feedback in improvements or how to make templating easier. Because I feel like it's a bother (not a big one but still) to set this up initially

### Credits

The idea for FFS came after seeing this extension [ee92.folderize](https://marketplace.visualstudio.com/items?itemName=ee92.folderize)
