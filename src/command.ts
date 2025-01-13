/**
 * this is kind of generic command class but for editor. 
 * it might need to be refactored if to be used other than just editor. 
 * probably will need to revise to make it either even more generic or 
 * even more to specific use-case.
 */

import * as vscode from "vscode";
import { ActiveEditor } from "./editor/ActiveEditor";
import { LineType as LT } from "./editor/Line";
import { LineUtil } from "./common/LineUtil";




/**
 * thsese command ids should match the commands names in package.json. 
 * the values of these enums are to see if they allow or block certain conditions 
 * when the callbacks collide when they try to edit the overlapping range 
 * which i will lead to runtime error when that happes. 
 */
export enum EditorCommandId {
    removeTrailingWhitespaceFromSelection = LT.LineEditCollisionGroup.NO_RANGE_OVERLAPPING + LT.LineEditCollisionGroup.PRIORITY,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection = LT.LineEditCollisionGroup.NO_RANGE_OVERLAPPING + LT.LineEditCollisionGroup.IGNORE_ON_COLLISION,
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

    #ActiveEditor : ActiveEditor;
    // these private variables defines the line function bindings.
    #removeTrailingWhiteSpaceFromLine;
    #removeMultipleWhitespaceFromLine;
    #removeMulitpleEmptyLines;
    #removeCommentedTextFromLines;
    #removeEmptyLines;
    #removeDuplicateLines;
    #cleanUpBlockCommentLines;
    #setNowDateTimeOnLineOnLine;

    constructor() {
        this.#ActiveEditor = new ActiveEditor();

        // these private variables defines the line function bindings and details.
        // the aim was to make the line edit functions as generic as possible 
        // so it is reusable. these callback binding could be implemented here 
        // however then those functions are not portable. 

        this.#removeTrailingWhiteSpaceFromLine = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeTrailingWhiteSpace,
            type: LT.LineEditType.DELETE,
        };
    
        this.#removeMultipleWhitespaceFromLine = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeMultipleWhitespace,
            type: LT.LineEditType.REPLACE,
        };
    
        this.#removeMulitpleEmptyLines = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeMulitpleEmptyLine,
            type: LT.LineEditType.DELETE,
            block: true
        };
    
        this.#removeCommentedTextFromLines = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeCommentedLine,
            type: LT.LineEditType.DELETE,
        };
    
        this.#removeEmptyLines = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeEmptyLine,
            type: LT.LineEditType.DELETE,
            block: true
        };

        this.#removeDuplicateLines = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.removeDuplicateLine,
            type: LT.LineEditType.DELETE,
            block: true
        };

        this.#cleanUpBlockCommentLines = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.cleanUpBlockCommentLine,
            type: LT.LineEditType.DELETE,
            block: true
        };
            
        this.#setNowDateTimeOnLineOnLine = <LT.LineEditDefintion>{
            func: this.#ActiveEditor.setNowDateTimeOnLine,
            type: LT.LineEditType.APPEND,
        };

        
    }
    
    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    /**
     * removes trailing whitespace from the line.
     * 
     * function type is; line.delete. 
     * 
     * @param editor unused, future reference  
     * @param edit unused, future reference 
     * @param args unused, future reference 
     */
    public removeTrailingWhitespaceFromSelection = (editor, edit, args) : void => {
        // this is example funciton with arugments for future refernce in case
        // if it needs to use them. 
        this.#ActiveEditor.prepareEdit([
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };
            
    /**
     * removes multiple empty lines with EOL. 
     * this function will check if the currnt range and next range are 
     * both whitespace lines and if true, delete current range with EOL. 
     * function type is; line.delete.
     * 
     */
    public removeMulitpleEmptyLinesFromSelection = () : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeMulitpleEmptyLines,
        ],
        false);
    };

    /**
     * removes whitespaces that are longer than 1. 
     * this function will ignore starting whitespace group 
     * and remove all whitespaces in the line. 
     * this function could lead into range overlapping, which means 
     * that there is multiple edits in the same range which seems is 
     * not allowed. this collision happens when the range is 
     * empty line with whitespaces only and it start with it. 
     * more details in trailing whitespace function.
     * 
     */
    public removeMultipleWhitespaceFromSelection = () : void =>  {
        this.#ActiveEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    /**
     * this will remove all empty whitespace lines from selection
     * function type is line.delete.
     */
    public removeEmptyLinesFromSelection = () : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeEmptyLines,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    /**
     * this will remove all commented lines from selection
     * function type is line.delete with EOL.
     */
    public removeCommentedTextFromSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeCommentedTextFromLines
        ],
        false);
    };

    public removeDuplicateLineFromSelection = () : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeDuplicateLines
        ],
        false);
    };

    public cleanUpBlockCommentFromSelection = () => {
        this.#ActiveEditor.prepareEdit([
            this.#cleanUpBlockCommentLines,
        ],
        false);
    };

    /**
     * this command will do combined edit which are; 
     * - removeMultipleWhitespaceFromLine
     * - removeTrailingWhiteSpaceFromLine
     * - removeMulitpleEmptyLines
     * - cleanUpBlockCommentLines
     */
    public cleanUpWhitespaceFromSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine,
            this.#cleanUpBlockCommentLines,
            this.#removeMulitpleEmptyLines
        ],
        false);
    };

    /**
     * this command will print datetime on where the cursor is.
     */
    public printNowDateTimeOnSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#setNowDateTimeOnLineOnLine
        ],
        false);
    };

    // public joinMultipleLines = () => {
    //     this.editorEdit(this.joinLines);
    // };

    // public joinCommnetLines = () => {
    //     this.editorEdit(this.joinLines);
    // };
}

