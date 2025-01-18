/**
 * this is kind of generic command class but for editor. 
 * it might need to be refactored if to be used other than just editor edit. 
 * probably will need to revise to make it either even more generic or 
 * even more to specific use-case.
 */

import * as vscode from "vscode";
import { ActiveEditor } from "./editor/ActiveEditor";
import { LineType as LT } from "./editor/Line";

/**
 * thsese command ids should match the commands names in package.json. 
 * the values of these enums are to see if they allow or block certain conditions 
 * when the callbacks collide when they try to edit the overlapping range 
 * which i will lead to runtime error when that happes. 
 */
export enum EditorCommandId {
    removeTrailingWhitespaceFromSelection,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection,
    removeCommentedTextFromSelection,
    removeDuplicateLineFromSelection,
    cleanUpBlockCommentFromSelection,
    cleanUpWhitespaceFromSelection,
    printNowDateTimeOnSelection,
};

/**
 * implementations of the functions with same name as key. 
 * this is to keep the integrity and simplify if the commands have
 * implementaion and does exist and prevent mismatch of the funciton names.
 * and becuase the command id is enum. 
 * 
 * if this 
 * 
 */
type CommandInterface = {
    [K in Exclude<keyof typeof EditorCommandId, number>]: (...args: any[]) => void;
};

/**
 * this class handles information about the editor comamnds to be bound. 
 * because this class might be used to other than just editor comnand, 
 * i wanted to explicitily control the editor related command 
 * so it is probably the best not to inherit from other classes and use them
 * as composition. 
 * 
 */
export class Command implements CommandInterface {

    #activeEditor: ActiveEditor;
    // these private variables defines the line function bindings.
    // lineHandler binding 
    #removeTrailingWhiteSpaceFromLine;
    #removeMultipleWhitespaceFromLine ;
    #removeMulitpleEmptyLines;
    #removeCommentedTextFromLines;
    #removeEmptyLines;
    #removeDuplicateLines;
    #removeEmptyBlockCommentLineOnStart;
    #removeMultipleEmptyBlockCommentLine;
    #insertEmptyBlockCommentLineOnEnd;
    #removeEmptyLinesBetweenBlockCommantAndCode;
    #removeDocumentStartingEmptyLines;
    #setNowDateTimeOnLineOnLine;

    constructor() {
        this.#activeEditor = new ActiveEditor();

        // these private variables defines the line function bindings and details.
        // the aim was to make the line edit functions as generic as possible 
        // so it is reusable. these callback binding could be implemented here 
        // however then those functions are not portable. 
        this.#removeDocumentStartingEmptyLines = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeDocumentStartingEmptyLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.HIGH
            }
        };

        this.#removeTrailingWhiteSpaceFromLine = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeTrailingWhiteSpace,
            type: LT.LineEditType.DELETE
        };

        this.#removeMultipleWhitespaceFromLine = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeMultipleWhitespace,
            type: LT.LineEditType.REPLACE,
        };

        this.#removeMulitpleEmptyLines = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeMulitpleEmptyLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.MID
            }
        };

        this.#removeCommentedTextFromLines = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeCommentedLine,
            type: LT.LineEditType.DELETE,
        };

        this.#removeEmptyLines = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeEmptyLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };

        this.#removeDuplicateLines = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeDuplicateLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };

        this.#removeEmptyBlockCommentLineOnStart = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeEmptyBlockCommentLineOnStart,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.VERYHIGH
            }
        };

        this.#removeMultipleEmptyBlockCommentLine = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeMultipleEmptyBlockCommentLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.HIGH
            }
        };

        this.#removeEmptyLinesBetweenBlockCommantAndCode = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.removeEmptyLinesBetweenBlockCommantAndCode,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.HIGH
            }
        };

        this.#insertEmptyBlockCommentLineOnEnd = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.insertEmptyBlockCommentLineOnEnd,
            type: LT.LineEditType.APPEND,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };

        this.#setNowDateTimeOnLineOnLine = <LT.LineEditDefintion>{
            func: this.#activeEditor.lineHandler.setNowDateTimeOnLine,
            type: LT.LineEditType.APPEND,
        };
    }

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    /**
     * removes trailing whitespace from the line.
     *
     *
     * @param editor unused, future reference
     * @param edit unused, future reference
     * @param args unused, future reference
     */
    public removeTrailingWhitespaceFromSelection = (editor, edit, args): void => {
        // this is example funciton with arugments for future refernce in case
        // if it needs to use them.
        this.#activeEditor.prepareEdit([
            this.#removeTrailingWhiteSpaceFromLine
        ], false);
    };

    /**
     * removes multiple empty lines with EOL. 
     * this function will check if the currnt range and next range are 
     * both whitespace lines and if true, delete current range with EOL. 
     * function type is; line.delete.
     * 
     */
    public removeMulitpleEmptyLinesFromSelection = (): void => {
        this.#activeEditor.prepareEdit([
            this.#removeDocumentStartingEmptyLines,
            this.#removeMulitpleEmptyLines,
        ], false);
    };
    
    /**
     * removes whitespaces that are longer than 1. 
     * this function will ignore indentation and keep the indent. 
     * 
     */
    public removeMultipleWhitespaceFromSelection = () : void => {
        this.#activeEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ], false);
    }; 

    /**
     * remove all empty whitespace lines from selection
     * function type is line.delete.
     */
    public removeEmptyLinesFromSelection = (): void => {
        this.#activeEditor.prepareEdit([
            this.#removeEmptyLines,
            this.#removeTrailingWhiteSpaceFromLine
        ], false);
    };

    /**
     * remove all commented lines from selection
     * function type is line.delete with EOL.
     */
    // test commant 
    public removeCommentedTextFromSelection = (): void => {
        // comment line 1
        this.#activeEditor.prepareEdit([
            this.#removeCommentedTextFromLines
        ], false);
    }; // and another 

    /**
     * remove the current line if next line is identical as the current one. 
     */
    public removeDuplicateLineFromSelection = (): void => {
        this.#activeEditor.prepareEdit([
            this.#removeDuplicateLines
        ], false);
    };

    /**
     * clean up any block commants includes jsdoc. 
     * 
     * if next line after block command starting line is empty block comment, 
     * remove until the line is not empty. also delete line if the current line 
     * and next line is also empty block comment line. i will append empty block 
     * 
     * comment line. if the current line is not empty block comment line and next 
     * line is block comment ending line. 
     * 
     */
    public cleanUpBlockCommentFromSelection = () => {
        this.#activeEditor.prepareEdit([
            this.#removeEmptyBlockCommentLineOnStart,
            this.#removeMultipleEmptyBlockCommentLine,
            this.#insertEmptyBlockCommentLineOnEnd,
            this.#removeEmptyLinesBetweenBlockCommantAndCode
        ], false);
    };

    /**
     * combined edit which are; 
     * - removeMultipleWhitespaceFromLine
     * - removeTrailingWhiteSpaceFromLine
     * - removeMulitpleEmptyLines
     * - cleanUpBlockCommentLines
     */

    public cleanUpWhitespaceFromSelection = (): void => {
        this.#activeEditor.prepareEdit([
            this.#removeDocumentStartingEmptyLines,
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine,
            this.#removeEmptyBlockCommentLineOnStart,
            this.#removeMultipleEmptyBlockCommentLine,
            this.#insertEmptyBlockCommentLineOnEnd,
            this.#removeEmptyLinesBetweenBlockCommantAndCode,
            this.#removeMulitpleEmptyLines
        ], false);
    };

    /**
     * print datetime on where the cursor is.
     */
    public printNowDateTimeOnSelection = (): void => {
        this.#activeEditor.prepareEdit([
            this.#setNowDateTimeOnLineOnLine
        ], false);
    };

    // public joinMultipleLines = () => {
    //     this.editorEdit(this.joinLines);
    // };

    // public joinCommnetLines = () => {
    //     this.editorEdit(this.joinLines);
    // };
}

