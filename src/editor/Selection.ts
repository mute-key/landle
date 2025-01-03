
import * as vscode from "vscode";

import { Line } from './Line';
// import { Command } from "../common/command";
import { pushMessage, DateStamp } from "../common/util";

/**
 * TODO:
 * need snipets for all kinds of things 
 * remove trailing whitespace <- this alone is enough.
 * remove mutiple whitesplace lines into 1  
 * 
 * 
 * 
 */

export class LineSelection extends Line {
    constructor() {
        super();
    }

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    public removeTrailingWhitespaceFromSelection = () : void => {
        this.editorEdit(this.removeTrailingWhiteSpaceFromLine);
    };

    public removeMulitpleEmptyLinesFromSelection = () : void => {
        this.editorEdit(this.removeMulitpleEmptyLines);
    };

    public removeEmptyLinesFromSelection = () : void => {
        this.editorEdit(this.removeEmptyLines);
    };

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

