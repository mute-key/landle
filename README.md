# Introduction

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mutekey.landle) <br>

This is my rehab code and may not be fully complete.
i wanted a extension like this although a linter can do this sort of things but need non-language specific generic formatter.
I did not aim to make a functions which formatters can do already.

<br>

## Configurations

- autoSaveAfterEdit: enum[commandList:string] (default = "disabled")
- autoTriggerOnSave: default true boolean (default = true)
- addExtraLineAtEndOnBlockComment: boolean (default = false)
- deleteCommentAlsoDeleteBlockComment: boolean (default = false)
- blockCommentWordCountJustifyAlign: boolean (default = true)
- blockCommentCharacterBoundaryBaseLength: number (default = 70)
- blockCommentCharacterBoundaryTolanceLength: number (default = 5)
-

<br><br>

## Commands

Each command call has its functions as a class member functions. no functionality call overlap even it would seeems to.

> Command -> __removeDocumentStartingEmptyLine__<br>

Shortcut key : __`not assigned`__<br>

- Removes doucment starting empty-lines if document starting line is in selection.

<img src="./demo/removeDocumentStartingEmptyLine.gif" alt ="GIF" height ="280" style="border: solid 3px black">

************************************************************************************************************************************

> Command -> __removeTrailingWhitespaceFromSelection__<br>

Shortcut key : __`ctrl + alt + w`__<br>

- Removes trailing whitespaces from the lines in selection.

<img src="./demo/removeTrailingWhitespaceFromSelection.gif" alt ="GIF" height ="240" style="border: solid 3px black">

************************************************************************************************************************************

> Command -> __removeMulitpleEmptyLinesFromSelection__<br>

Shortcut key : __`ctrl + alt + m`__<br>

- Remove lines either empty or whitespace only in selection range but leaving 1 empty lines to keep the contents block.

<img src="./demo/removeMulitpleEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

************************************************************************************************************************************

> Command -> __removeEmptyLinesFromSelection__<br>

Shortcut key : __`ctrl + alt + e`__<br>

- Removes lines either empty or whitespace only in selection range.

<img src="./demo/removeEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

************************************************************************************************************************************

> Command -> __removeMultipleWhitespaceFromSelection__<br>

Shortcut key : __`ctrl + alt + space`__<br>

- Removes whitespaces characters that are longer than size of 1.<br>
this command ignores indentation.

<img src="./demo/removeMultipleWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

************************************************************************************************************************************

> Command -> __removeCommentedTextFromSelection__<br>

Shortcut key : __`ctrl + alt + /`__<br>

- Removes all comment only lines.

************************************************************************************************************************************

> Command -> __removeEmptyBlockCommentLineOnStart__<br>

Shortcut key : __`not assigned`__<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.

************************************************************************************************************************************

> Command -> __removeMultipleEmptyBlockCommentLine__<br>

Shortcut key : __`not assigned`__<br>

- Removes continuos empty-block-comment-lines.

************************************************************************************************************************************

> Command -> __insertEmptyBlockCommentLineOnEnd__<br>

Shortcut key : __`not assigned`__<br>

- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.

************************************************************************************************************************************

> Command -> __removeEmptyLinesBetweenBlockCommantAndCode__<br>

Shortcut key : __`not assigned`__<br>

- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.

************************************************************************************************************************************

> Command -> __blockCommentWordCountAutoLengthAlign__<br>

Shortcut key : **`ctrl + alt + a`

- Auto adjust block-comment line length.

Related Configurations

- blockCommentCharacterBoundaryBaseLength (default 70) : Minimum Line length of block comment.
- blockCommentCharacterBoundaryTolanceLength (default 10) : Character count margin for the line.

************************************************************************************************************************************

> Command -> __printNowDateTimeOnSelection__<br>

Shortcut key : __`ctrl + alt + n`__<br>

- Print DateTime string on current position of the selection.

************************************************************************************************************************************

> Command -> __blockCommentWordCountJustifyAlign__<br>

Shortcut key : __`ctrl + alt + a`__<br>

- Read the line and count the length, trigger funciton if the character count is bigger than `config.blockCommentCharacterBoundaryBaseLength` + `config.blockCommentCharacterBoundaryTolanceLength`. if the character count is less, the function will concatinate next line words until it is bigger than `config.blockCommentCharacterBoundaryBaseLength` and will continue unitl the line is not empty-block-comment line.

<img src="./demo/blockCommentWordCountJustifyAlig.gif" alt ="GIF" style="border: solid 3px black" height ="280">

<br>

## Commands group

Here are the list of commands that combined multiple commands.

> Command -> __cleanUBlockCommentCommand__<br>

Shortcut key : __`ctrl + alt + b`__<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.
- Removes continuos empty-block-comment-lines.
- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.
- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.
- blockCommentWordCountJustifyAlign

<img src="./demo/cleanUpBlockCommentFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="270">
<br><br><br>

> Command -> __cleanUpCodeCommand__<br>

Shortcut key : __`ctrl + alt + x`__<br>

- Removes starting empty lines on document if the range is selected.
- Removes trailing whitespaces from selection.
- Removes Multiple whitespace-characters that are longer than length of 1.
- Removes multiple whitespace-lines that are more than 1 but keeping 1.
- blockCommentWordCountJustifyAlign

<br>
<img src="./demo/cleanUpCodeCommand.gif" alt ="GIF" style="border: solid 3px black" height ="330">
<br><br><br>

> Command -> __cleanUpDocumentCommand__<br>

Shortcut key : __`ctrl + alt + c`__<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.
- Removes continuos empty-block-comment-lines.
- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.
- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.
- Removes starting empty lines on document if the range is selected.
- Removes trailing whitespaces from selection.
- Removes Multiple whitespace-characters that are longer than length of 1.
- Removes multiple whitespace-lines that are more than 1 but keeping 1.
- blockCommentWordCountJustifyAlign

<img src="./demo/cleanUpWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="330">

## backlog

- need better readme and relace old gif.
- should notify the user when the keybinding is already taken.
- Digest linter and perform auto correction based on lint config.
- removeCommentedLine improvement for trailing both previous line and next line.
- removeCommentedLine improvement to be ablet to delete block comment if it is in selection.

## changelog

version 0.9.2073

- cursor reset improvement. cursor no longer get put on random places after the line delete in all kinds of edit.

version 0.9.2061

- auto save trigger has been added for after command call with it's configuration.
- auto trigger command call before command call with it's configuration.
- new event class has been added.
- removeMultipleWhitespace function no longer remove multiple whitespaces on inline comment.
- extension icon added.

version 0.9.206

- code split on lineHandler.ts
- function improvement on blockCommentWordCountJustifyAlign
- blockCommentCharacterBoundaryTolanceLength default value to 5

version 0.9.2051

- readme improvement
- added new extension configuration `deleteCommentAlsoDeleteBlockComment`