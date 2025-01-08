
import * as vscode from "vscode";

import { ActiveEditor } from "./editor/ActiveEditor";

import { 
    LineEditType, 
    LineEditDefintion,
    LineEditTypeChecker as ledc, 
} from "./editor/Line";

export enum CommandId {
    removeTrailingWhitespaceFromSelection = ledc.DEFAULT + ledc.SINGLE_LINE_ONLY_ALLOWED + ledc.EMPTY_LINE_ALLOWED + ledc.CURSOR_ONLY_ALLOWED,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespaceFromSelection,
    removeCommentedTextFromSelection,
    cleanUpWhitespaceFromSelection,
    printNowDateTimeOnSelection,
};

export class Command extends ActiveEditor {
    constructor() {
        super();
    }
    
    // =============================================================================
    // > PRIVATE VARIABLES: 
    // =============================================================================

    #removeTrailingWhiteSpaceFromLine = <LineEditDefintion>{
        func: this.line.removeTrailingWhiteSpaceFromLine,
        type: LineEditType.DELETE,
    };

    #removeMultipleWhitespaceFromLine = <LineEditDefintion>{
        func: this.line.removeMultipleWhitespaceFromLine,
        type: LineEditType.REPLACE,
    };

    #removeMulitpleEmptyLines = <LineEditDefintion>{
        func: this.line.removeMulitpleEmptyLines,
        type: LineEditType.DELETE,
    };

    #removeCommentedTextFromLine = <LineEditDefintion>{
        func: this.line.removeCommentedLine,
        type: LineEditType.DELETE,
    };

    #removeEmptyLinesFromLine = <LineEditDefintion>{
        func: this.line.removeEmptyLines,
        type: LineEditType.DELETE,
    };

    #setNowDateTimeOnLineOnLine = <LineEditDefintion>{
        func: this.line.setNowDateTimeOnLine,
        type: LineEditType.APPEND,
    };

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    public removeTrailingWhitespaceFromSelection = (editor, edit, args) : void => {
        this.prepareEdit([
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    public removeMulitpleEmptyLinesFromSelection = () : void => {
        this.prepareEdit([
            this.#removeMulitpleEmptyLines,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    public removeEmptyLinesFromSelection = () : void => {
        this.prepareEdit([
            this.#removeEmptyLinesFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };

    public removeMultipleWhitespace = () :void => {
        this.prepareEdit([
            this.#removeMultipleWhitespaceFromLine,
            this.#removeTrailingWhiteSpaceFromLine
        ],
        false);
    };
    public removeCommentedTextFromSelection = () :void => {
        this.prepareEdit([
            this.#removeCommentedTextFromLine
        ],
        false);
    };

    public cleanUpWhitespaceFromSelection = () :void => {
        this.prepareEdit([
            this.#removeTrailingWhiteSpaceFromLine, 
            this.#removeMultipleWhitespaceFromLine,
            this.#removeMulitpleEmptyLines
        ],
        false);
    };

    public printNowDateTimeOnSelection = () :void => {
        this.prepareEdit([
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

