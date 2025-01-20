# Introduction
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mutekey.landle)

this is my rehab code.
i did not aim to make a funciton which formatter can do already. 

# Commands

Each command call has its functions as a class member functions. no functionality call overlap even it would seeems to. 

#### > __removeTrailingWhitespaceFromSelection__<br>
Shortcut key : `ctrl + alt + w`<br>

removes trailing whitespaces from the lines in selection. 

<img src="./demo/removeTrailingWhitespaceFromSelection.gif" alt ="GIF" height ="240" style="border: solid 2px black">

<br><hr><br>

#### > __removeMulitpleEmptyLinesFromSelection__<br>
Shortcut key : `ctrl + alt + m`<br>

remove lines either empty or whitespace only in selection range but leaving 1 empty lines to keep the contents block.

<img src="./demo/removeMulitpleEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 2px black" height ="240">

<br><hr><br>

#### > __removeEmptyLinesFromSelection__<br>
Shortcut key : `ctrl + alt + e`<br>

removes lines either empty or whitespace only in selection range.

<img src="./demo/removeEmptyLinesFromSelection.gif" alt ="GIF" style="border: solid 2px black" height ="240">

<br><hr><br>

#### > __removeMultipleWhitespaceFromSelection__<br>
Shortcut key : `ctrl + alt + space`<br>

removes whitespaces characters that are longer than size of 1.<br>
this command ignores indentation. 

<img src="./demo/removeMultipleWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 2px black" height ="240">

<br><hr><br>

#### > __removeCommentedTextFromSelection__<br>
Shortcut key : `ctrl + alt + /`<br>

removes all commented lines. 

<br><hr><br>

#### > __removeDuplicateLineFromSelection__<br>
Shortcut key : `ctrl + alt + d`<br>

removes redundant lines and leaving only 1 of the line. 

<br><hr><br>

#### > __cleanUBlockCommentCommand__<br>
Shortcut key : `ctrl + alt + b`<br>

- removes empty block comment lines between block comment starting line and non empty block comment lines. 
- removes duplicate empty block comment lines.
- removes empty whitespace lines after block comment ending line and non empty whitespace lines. 
- insert empty block comment lines before block comment ending lines and non empty block comment lines. 

<img src="./demo/cleanUpBlockCommentFromSelection.gif" alt ="GIF" style="border: solid 2px black" height ="270">

<br><hr><br>

#### > __cleanUpDocumentCommand__<br>
Shortcut key : `ctrl + alt + c`<br>

<br>
<img src="./demo/cleanUpWhitespaceFromSelection.gif" alt ="GIF" style="border: solid 2px black" height ="330">

<br><hr><br>

#### > __printNowDateTimeOnSelection__<br>
Shortcut key : `ctrl + alt + n`<br>

print DateTime string on current position of the selection.

<br><hr><br>





