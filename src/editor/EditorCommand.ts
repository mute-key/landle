/**
 * this is kind of generic command class but for editor.
 * it might need to be refactored if to be used other than just editor edit.
 * probably will need to revise to make it either even more generic or
 * even more to specific use-case.
 * 
 */
import * as vscode from "vscode";
import { ActiveEditor } from "./ActiveEditor";
import { LineType as LT } from "./Line";

/**
 * thsese command ids should match the commands names in package.json.
 * the values of these enums are to see if they allow or block certain conditions
 * when the callbacks collide when they try to edit the overlapping range
 * which i will lead to runtime error when that happes.
 * 
 */
export enum EditorCommandId {
    removeDocumentStartingEmptyLine,
    removeTrailingWhitespaceFromSelection,
    removeMulitpleEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection,
    removeEmptyLinesFromSelection,
    removeCommentedTextFromSelection,
    removeDuplicateLineFromSelection,
    removeEmptyBlockCommentLineOnStart,
    removeMultipleEmptyBlockCommentLine,
    insertEmptyBlockCommentLineOnEnd,
    removeEmptyLinesBetweenBlockCommantAndCode,
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
export class EditorCommand implements CommandInterface {
    #activeEditor: ActiveEditor;

    constructor() {
        this.#activeEditor = new ActiveEditor();
    }

    // =============================================================================
    // > PUBLIC FUNCTIONS:
    // =============================================================================

    public execute = (command : LT.LineEditDefintion[], includeFullEdiotr: boolean) : void => {
        this.#activeEditor.prepareEdit(command, includeFullEdiotr);
    };

    /**
     * @returns
     * 
     */
    public removeDocumentStartingEmptyLine = () : LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeDocumentStartingEmptyLine,
            type: LT.LineEditType.DELETE
        };
    };

    /**
     * removes trailing whitespace from the line.
     *
     * @param editor unused, future reference
     * @param edit unused, future reference
     * @param args unused, future reference
     * 
     */
    public removeTrailingWhitespaceFromSelection = (editor?, edit?, args?) : LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeTrailingWhiteSpace,
            type: LT.LineEditType.DELETE
        };
    };

    /**
     * removes multiple empty lines with EOL.
     * this function will check if the currnt range and next range are
     * both whitespace lines and if true, delete current range with EOL.
     * function type is; line.delete.
     * 
     */
    public removeMulitpleEmptyLinesFromSelection = () : LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeMulitpleEmptyLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.MID
            }
        };
    };
    
    /**
     * removes whitespaces that are longer than 1.
     * this function will ignore indentation and keep the indent.
     * 
     */
    public removeMultipleWhitespaceFromSelection = () : LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeMultipleWhitespace,
            type: LT.LineEditType.REPLACE,
        };
    };

    /**
     * remove all empty whitespace lines from selection
     * function type is line.delete.
     * 
     */
    public removeEmptyLinesFromSelection = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeEmptyLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };
    };

    /**
     * remove all commented lines from selection
     * function type is line.delete with EOL.
     * 
     */
    public removeCommentedTextFromSelection = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeCommentedLine,
            type: LT.LineEditType.DELETE,
        };
    };

    /**
     * remove the current line if next line is identical as the current one.
     * 
     */
    public removeDuplicateLineFromSelection = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeDuplicateLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };
    };

    public removeEmptyBlockCommentLineOnStart = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeEmptyBlockCommentLineOnStart,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.VERYHIGH
            }
        };
    };

    public removeMultipleEmptyBlockCommentLine = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeMultipleEmptyBlockCommentLine,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.HIGH
            }
        };
    };

    public insertEmptyBlockCommentLineOnEnd = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().insertEmptyBlockCommentLineOnEnd,
            type: LT.LineEditType.APPEND,
            block: {
                priority: LT.LineEditBlockPriority.LOW
            }
        };
    };

    public removeEmptyLinesBetweenBlockCommantAndCode = () : LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().removeEmptyLinesBetweenBlockCommantAndCode,
            type: LT.LineEditType.DELETE,
            block: {
                priority: LT.LineEditBlockPriority.HIGH
            }
        };
    };

    public printNowDateTimeOnSelection = (): LT.LineEditDefintion => {
        return {
            func: this.#activeEditor.lineHandler().setNowDateTimeOnLine,
            type: LT.LineEditType.APPEND,
        };
    };
}
