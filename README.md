## Introduction

this is my rehab code 

will not implement what formatter can do already 


## Commands

each command call has its functions as a class member functions. no functionality call overlap even it would seeems to. 



#### > __deco.removeTrailingWhitespaceFromSelection__<br>
shortcut key : `ctrl + alt + w`<br>

removes trailing whitespaces from the line. 

<br><br>


#### > __deco.removeMulitpleEmptyLinesFromSelection__<br>
shortcut key : `ctrl + alt + m`<br>

removes continous lines either empty or whitespace only strings within the selection but leaving 1 empty lines to keep the contents block.

<br><br>


#### > __deco.removeEmptyLinesFromSelection__<br>
shortcut key : `ctrl+ alt+ e`<br>

removes continous lines either empty or whitespace only strings within the selection.

<br><br>


#### > __deco.removeCommentedTextFromSelection__<br>
shortcut key : `ctrl + alt + /`<br>

removes continous lines either empty or whitespace only strings within the selection.

<br><br>

#### > __deco.removeMultipleWhitespaceFromSelection__<br>
shortcut key : `ctrl + alt + space`<br>

removes whitespaces within the characters if the whitespace is longer than 1.<br>
the starting index is after the indentation. this command will be executed with;<br>
[+] removeTrailingWhitespaceFromSelection<br>

<br><br>


#### > __deco.cleanUpWhitespaceFromSelection__<br>
shortcut key : `ctrl + alt + c`<br>

This command is the combination of these commands. Probably most useful commands.<br>
[+] removeMulitpleEmptyLinesFromSelection<br>
[+] removeTrailingWhitespaceFromSelection<br>
[+] removeMultipleWhitespaceFromSelection<br>

<br><br>

#### > __deco.printNowDateTime__

shortcut key :`ctrl + alt + n`<br>

print DateTime string on current position of the selection.



# todo

prob editor focus related. 

tab control 
tab group control


more shortcut keys 


