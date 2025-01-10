
import * as vscode from "vscode";

import { ActiveEditor } from "./editor/ActiveEditor";

import { 
    LineEditType, 
    LineEditDefintion,
    LineEditCollisionGroup as lecg,
} from "./editor/Line";

export enum CommandId {
    removeTrailingWhitespaceFromSelection = lecg.NO_RANGE_OVERLAPPING + lecg.PRIORITY,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection = lecg.NO_RANGE_OVERLAPPING + lecg.IGNORE_ON_COLLISION,
    removeCommentedTextFromSelection,
    cleanUpWhitespaceFromSelection,
    printNowDateTimeOnSelection,
};

export class Command {
    // this.#ActiveEditor = new ActiveEditor();
    
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

    public removeTrailingWhitespaceFromSelection = (editor, edit, args) : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };
            
    public removeMulitpleEmptyLinesFromSelection = () : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeMulitpleEmptyLines,
        ],
        false);
    };

    public removeMultipleWhitespaceFromSelection = () : void =>  {
        this.#ActiveEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    public removeEmptyLinesFromSelection = () : void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeEmptyLinesFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    public removeCommentedTextFromSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeCommentedTextFromLines
        ],
        false);
    };

    public cleanUpWhitespaceFromSelection = () :void => {
        this.#ActiveEditor.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine, 
            this.#removeMulitpleEmptyLines
        ],
        false);
    };

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

