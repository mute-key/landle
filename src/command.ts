
import * as vscode from "vscode";

// import { Line } from './Line';
import { ActiveEditor } from "./editor/ActiveEditor";
import { 
    LineEditType, 
    LineEditTypeChecker as ledc, 
    LineEditCallback,
    Line 
} from "./editor/Line";

// import { 
//     pushMessage 
// } from "./common/util";

/**
 * TODO:
 * need snipets for all kinds of things 
 * remove trailing whitespace <- this alone is enough.
 * remove mutiple whitesplace lines into 1  
 * 
 * 
 * 
 */

export enum CommandId {
    removeTrailingWhitespaceFromSelection = ledc.DEFAULT + ledc.SINGLE_LINE_ONLY_ALLOWED + ledc.EMPTY_LINE_ALLOWED + ledc.CURSOR_ONLY_ALLOWED,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespace,
    cleanUpWhitespace,
    printNowDateTime,
    test

    // commentBlock = "commentBlock",
    // addToTitle = "addToTitle",
    // createSection = "createSection",
    // cleanWhiteSpaceLines = "cleanWhiteSpaceLines",
    // removeLine = "removeLine",
    // addDateStamp = "addDateStamp",
    // addTimeStamp = "addTimeStamp",
};

export class Command extends ActiveEditor{

    

    constructor() {
        super();
        
    }

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    public removeTrailingWhitespaceFromSelection = (editor, edit, args) : void => {
        this.snapshotDocument();
        this.prepareEdit(<LineEditCallback>{
                func: this.line.removeTrailingWhiteSpaceFromLine,
                type: LineEditType.DELETE,
            },
            false
        );

        // console.log('command removeTrailingWhitespaceFromSelection');
        // this.doEdit(this.removeTrailingWhiteSpaceFromLine);
    };

    public removeMulitpleEmptyLinesFromSelection = () : void => {
        // this.doEdit(this.removeMulitpleEmptyLines);
    };

    public removeEmptyLinesFromSelection = () : void => {
        // this.doEdit(this.removeEmptyLines);
    };

    public removeMultipleWhitespace = () :void => {
        this.snapshotDocument();
        this.prepareEdit([
            <LineEditCallback>{
                func: this.line.removeMultipleWhitespaceFromLine,
                type: LineEditType.REPLACE,
            }],
            false
        );
    };

    public cleanUpWhitespace = () => {
        this.snapshotDocument();
        this.prepareEdit([
            // <LineEditCallback>{
            //     func: this.line.removeTrailingWhiteSpaceFromLine,
            //     type: LineEditType.DELETE,
            // }, 
            <LineEditCallback>{
                func: this.line.removeMultipleWhitespaceFromLine,
                type: LineEditType.REPLACE,
            }],
            false
        );
    };

    public printNowDateTime = () => {
        // this.doEdit(this.setNowDateTimeOnLine);
    };

    // public joinMultipleLines = () => {
    //     this.editorEdit(this.joinLines);
    // };

    // public joinCommnetLines = () => {
    //     this.editorEdit(this.joinLines);
    // };

    public repaceTabWithSpace = () => {
        
    };






    // private removeTrailingEmptyLines() {

    // }
    // private interateSelection = (selection , callback) => {};
    

    // public removeAllSelectedWhitespaceLines = () => {
    //     this.editorEdit(this.removeLine);
    // };

    
 
    

    // public justfityAlign() {
        
    // }

    // public cleanWhiteSpaceLines = () => {
    //     this.editor?.selections.forEach((range) => {
    //         if (range.isSingleLine) {


    //             // range
    //             // if ()
    //             // check if line is empty 


    //             // this.removeLine(range);
    //         } else {
    //             // range.start
    //             // this.removeMultipleLine(range);
    //         }
    //         // this.clearLine(range);
    //     });
    // };

    // public cleanMultipleWhiteSpaceLines = () => {
    //     this.editor?.selections.forEach((range) => {
    //         if (range.isSingleLine) {


    //             // this.removeLine(range);
    //         } else {
    //             // range.start
    //             // this.removeMultipleLine(range);
    //         }
    //         // this.clearLine(range);
    //     });
    // };

    

    // public removeAllSelectedLines = () => {
    //     // ctrl + alt + k 

    //     // console.log('removeAllSelectedLines');
        
    //     // // this.editor?.selections.;
    //     // this.editor?.selections.forEach((range) => {
    //     //     if (range.isSingleLine) {
    //     //         this.removeLine(range);
    //     //     } else {
    //     //         // range.start
    //     //         // this.removeMultipleLine(range);
    //     //     }
    //     // });
    // };
}

