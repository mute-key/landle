/**
 * this is kind of generic command class but for editor. 
 * it might need to be refactored if to be used other than just editor. 
 * probably will need to revise to make it either even more generic or 
 * even more to specific use-case.
 */


import { ActiveEditor } from "./editor/ActiveEditor";

import { 
    LineEditType, 
    LineEditDefintion,
    LineEditCollisionGroup as lecg,
} from "./editor/Line";

/**
 * thsese command ids should match the commands names in package.json. 
 * the values of these enums are to see if they allow or block certain conditions 
 * when the callbacks collide when they try to edit the overlapping range 
 * which i will lead to runtime error when that happes. 
 */
export enum EditorCommandId {
    removeTrailingWhitespaceFromSelection = lecg.NO_RANGE_OVERLAPPING + lecg.PRIORITY,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection = lecg.NO_RANGE_OVERLAPPING + lecg.IGNORE_ON_COLLISION,
    removeCommentedTextFromSelection,
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
    #removeTrailingWhiteSpaceFromLine;
    #removeMultipleWhitespaceFromLine;
    #removeMulitpleEmptyLines;
    #removeCommentedTextFromLines;
    #removeEmptyLinesFromLine;
    #setNowDateTimeOnLineOnLine;

    constructor() {
        this.#ActiveEditor = new ActiveEditor();

        this.#removeTrailingWhiteSpaceFromLine = <LineEditDefintion>{
            func: this.#ActiveEditor.removeTrailingWhiteSpace,
            type: LineEditType.DELETE,
        };
    
        this.#removeMultipleWhitespaceFromLine = <LineEditDefintion>{
            func: this.#ActiveEditor.removeMultipleWhitespace,
            type: LineEditType.REPLACE,
        };
    
        this.#removeMulitpleEmptyLines = <LineEditDefintion>{
            func: this.#ActiveEditor.removeMulitpleEmptyLine,
            type: LineEditType.DELETE,
        };
    
        this.#removeCommentedTextFromLines = <LineEditDefintion>{
            func: this.#ActiveEditor.removeCommentedLine,
            type: LineEditType.DELETE,
        };
    
        this.#removeEmptyLinesFromLine = <LineEditDefintion>{
            func: this.#ActiveEditor.removeEmptyLines,
            type: LineEditType.DELETE,
        };
    
        this.#setNowDateTimeOnLineOnLine = <LineEditDefintion>{
            func: this.#ActiveEditor.setNowDateTimeOnLine,
            type: LineEditType.APPEND,
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
            this.#removeEmptyLinesFromLine,
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

    /**
     * this command will do combined edit which are; 
     * - removeMultipleWhitespaceFromLine
     * - removeTrailingWhiteSpaceFromLine
     * - removeMulitpleEmptyLines
     */
    public cleanUpWhitespaceFromSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine,
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

