# Introduction

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mutekey.landle) <br>
[Check it on VS Marketplace](https://marketplace.visualstudio.com/items?itemName=mutekey.landle)

This is my rehab code.
I did not aim to make a funciton which formatter can do already.

<br>

## Individual commnads

Each command call has its functions as a class member functions. no functionality call overlap even it would seeems to.

> Command -> __removeDocumentStartingEmptyLine__<br>

Shortcut key : `not assigned`<br>

- Removes doucment starting empty-lines if document starting line is in selection.

<br><br>

> Command -> __removeTrailingWhitespaceFromSelection__<br>

Shortcut key : `ctrl + alt + w`<br>

- Removes trailing whitespaces from the lines in selection.

<img src="./demo/removeTrailingWhitespaceFromSelection.gif" alt ="GIF" height ="240" style="border: solid 3px black">

<br><br>

> Command -> __removeMulitpleEmptyLinesFromSelection__<br>

Shortcut key : `ctrl + alt + m`<br>

- Remove lines either empty or whitespace only in selection range but leaving 1 empty lines to keep the contents block.

<img src="./demo/removeMulitpleEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

<br><br>

> Command -> __removeEmptyLinesFromSelection__<br>

Shortcut key : `ctrl + alt + e`<br>

- Removes lines either empty or whitespace only in selection range.

<img src="./demo/removeEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

<br><br>

> Command -> __removeMultipleWhitespaceFromSelection__<br>

Shortcut key : `ctrl + alt + space`<br>

- Removes whitespaces characters that are longer than size of 1.<br>
this command ignores indentation.

<img src="./demo/removeMultipleWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="240">

<br><br>

> Command -> __removeCommentedTextFromSelection__<br>

Shortcut key : `ctrl + alt + /`<br>

- Removes all comment only lines.

<br><br>

> Command -> __removeEmptyBlockCommentLineOnStart__<br>

Shortcut key : `not assigned`<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.

<br><br>

> Command -> __removeMultipleEmptyBlockCommentLine__<br>

Shortcut key : `not assigned`<br>

- Removes continuos empty-block-comment-lines.

<br><br>

> Command -> __insertEmptyBlockCommentLineOnEnd__<br>

Shortcut key : `not assigned`<br>

- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.

<br><br>

> Command -> __removeEmptyLinesBetweenBlockCommantAndCode__<br>

Shortcut key : `not assigned`<br>

- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.

<br><br>

> Command -> __blockCommentWordCountAutoLengthAlign__<br>

Shortcut key : `ctrl + alt + a`
- Auto adjust block-comment line length.

Related Configurations
  - blockCommentCharacterBoundaryBaseLength (default 70) : Minimum Line length of block comment.
  - blockCommentCharacterBoundaryTolanceLength (default 10) : Character count margin for the line.


<br><br>



> Command -> __printNowDateTimeOnSelection__<br>

Shortcut key : `ctrl + alt + n`<br>

- Print DateTime string on current position of the selection.

<br><br>

## Commands group

Here are the list of commands that combined multiple commands.

> Command ->  __cleanUBlockCommentCommand__<br>

Shortcut key : `ctrl + alt + b`<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.
- Removes continuos empty-block-comment-lines.
- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.
- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.

<img src="./demo/cleanUpBlockCommentFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="270">
<br><br><br>

> Command ->  __cleanUpCodeCommand__<br>

Shortcut key : `ctrl + alt + x`<br>

- Removes starting empty lines on document if the range is selected.
- Removes trailing whitespaces from selection.
- Removes Multiple whitespace-characters that are longer than length of 1.
- Removes multiple whitespace-lines that are more than 1 but keeping 1.

<br>
<img src="./demo/cleanUpCodeCommand.gif" alt ="GIF" style="border: solid 3px black" height ="330">
<br><br><br>

> Command -> __cleanUpDocumentCommand__<br>

Shortcut key : `ctrl + alt + c`<br>

- Removes empty-block-comment-lines between block-comment-starting-line and non-empty-block-comment lines.
- Removes continuos empty-block-comment-lines.
- Removes empty-whitespace-lines after block-comment-ending-line and non-empty whitespace-lines.
- Insert empty-block-comment-lines before block-comment-ending-lines and non-empty-block-comment-lines.
- Removes starting empty lines on document if the range is selected.
- Removes trailing whitespaces from selection.
- Removes Multiple whitespace-characters that are longer than length of 1.
- Removes multiple whitespace-lines that are more than 1 but keeping 1.

<img src="./demo/cleanUpWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 3px black" height ="330">


## Future Features

- Digest linter and perform audo correction based on lint config.


