# Change Log

### 3.10.0

- Requires VSCode version 1.75.0
- Added support for custom template annotation
### 3.9.2

- No longer copy .DS_Store files on macOS. Thanks [tjunxin](https://github.com/tjunxin)

### 3.9.1

- Regression fix: Empty lines at the start and end of files will be kept again.
  - The function to trim file and folder names was placed wrongly and due to that also trimmed file content.

### 3.9.0

- New Feature: Prepending/Appending to existing files is now possible. see the [Examples](https://github.com/Huuums/vscode-folder-templates/tree/master/examples/Append%20Text%20to%20Existing%20File)
- fix a bug where losing when the inputbox lost focus the extension would move on as if the input was finished.
- fix a bug where pressing escape would not stop the creation process.
- fix a bug where the extension would allow invalid folder names by having spaces at the start or end of the names

### 3.8.1

- fix bug that would show "$ref" warnings in all kinds of json files

### 3.8.0

- Customizable global template directory (it is recommended to do this)
  - If your global templates were deleted when you updated the extension this is due to a major mistake I made. I hope I fixed it but it still can't be guaranteed. Please choose a custom directory for your global templates so this won't happen again.
  - DEPRECATED: The default Global Template directory will not be used anymore at some point in the future. So doing this sooner rather than later is encouraged.

### 3.7.0

- Thanks [hondzik](https://github.com/hondzik)
  - Added the option so templates can use an absolute path

### 3.6.1

- Fixed an issue where the extension would crash when no replace value is used

### 3.6.0

- Thank you very much [ThumNet](https://github.com/ThumNet)
  - added an option to open specific files automatically when template creation is done.

### 3.5.3

- added '&' operator to support chaining transformers in a filename

### 3.5.2

- fixed json schema reference for settings file

### 3.5.1

- Changed Readme a bit more (I really need to get into writing better and easier to understand docs)

### 3.5.0

- fixed json schemapath for vscode settings.json
- added the possibility to configure the template folder path.
- added a __static__ replace, replacefirst and replacelast function

### 3.4.1

-fixed .ftsettings.json schema

### 3.4.0

- Added `overwriteExistingFiles` property to structure settings

### 3.3.0

- Added Multifolder workspace support
- Fixed a bug where you couldn't have projects on a drive other than your system drive

### 3.2.1

- Added Extension Icon

### 3.2.0

- Thanks for all of these [mrelemerson](https://github.com/mrelemerson)
  - Added several new transformers.
  - Added functionality to chain transformers
  - Updated Docs

### 3.1.1

- fixed display error in inputbox when a customvariable has a defaultvalue

### 3.1.0

- added omitFTName option

### 3.0.1

- Fixed `Open Global Folder Template Directory` Command

### 3.0.0

Some breaking changes, I'm really sorry but I wanted to do this right and had to do it earlier rather than later. This will hopefully be the last breaking change

- **BREAKING**: The `FFSName` Placeholder no longer works. Please replace it with the new placeholder `FTName`

- **BREAKING**: Configuration namechange. Please switch the configuration keys from `fastFolderStructure.structures` to `folderTemplates.structures` and `fastFolderStructure.fileTemplates` to `folderTemplates.fileTemplates`.

- **BREAKING**: Calling the `FFS.createFolderStructure` command will no longer work. Please replace it with `FT.createFolderStructure`

- REMOVED: Creating a Template from an existing folder is no longer supported because you can now save templates on the filesystem.

- ADDED: Reading Folder Templates from your File System. You can now choose where to create your templates. In the config file or as a Folder on the File System.
- ADDED: You can now define defaultvalues for your customvariables with the new `variablename=>defaultvalue` notation.

Also added an examples folder.

### 2.1.0

- You can now pass in your own path argument with keybinds.

### 2.0.0

- BREAKING: Removed default structures and fileTemplates as they are generally not useful for anyone due to everyone having their own needs. You have to create your own templates now.

- If you create a template from an existing folder this extension will now save the new Template in your global or workspace settings. This depends on if you already have a workspace settings file with a template in it or not.

### 1.1.1

- Fix bug that filepaths weren't normalized when parent directory is ommited

### 1.1.0

- Added Create Template from Folder function
- Added Remove Template function
- Added `omitParentDirectory` flag
- Added `snakecase` and `kebabcase` transformers. Thanks [Torben](https://github.com/eWert-Online)

### 1.0.1

- Added transformer `lowercasefirstchar`
- Fixed `camelcase` transformer to lowercase the first char if it was uppercase
- Fixed a bug where deleting a newly created structure and then creating it again skipped files

### 1.0.0

- NO BREAKING CHANGES
- Yippieh. I feel as if the extension is stable enough for its first major release 1.0.0. Hopefully this didn't jinx it.
- Added tests
- No longer overwrites existing files
- Added transformer `camelcase` and `pascalcase`

### 0.4.0

- Added possibility to configure Custom Variables

### 0.3.2

- reverted some changes to fix behaviour

### 0.3.1

- fixed a bug where you couldn't create multiple empty Directories

### 0.3.0

- added an `EmptyDirectory` keyword

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
