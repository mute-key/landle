
import * as vscode from "vscode";

import { Line } from './Line';
// import { Command } from "../common/command";
import { 
    
    pushMessage 
} from "../common/util";

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
        console.log('command removeTrailingWhitespaceFromSelection');
        // this.doEdit(this.removeTrailingWhiteSpaceFromLine);
    };

    public removeMulitpleEmptyLinesFromSelection = () : void => {
        // this.doEdit(this.removeMulitpleEmptyLines);
    };

    public removeEmptyLinesFromSelection = () : void => {
        // this.doEdit(this.removeEmptyLines);
    };

    public removeMultipleWhitespace = () :void => {
        // this.doEdit(this.removeMultipleWhitespaceFromLine);
        
    };

    public cleanUpWhitespace = () => {
        // this.doEdit(async (range) => {
        //     await Promise.all([
        //         this.removeTrailingWhiteSpaceFromLine(range),
        //         this.removeMulitpleEmptyLines(range),
        //         this.removeMultipleWhitespaceFromLine(range)
        //     ]);
        // });
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

