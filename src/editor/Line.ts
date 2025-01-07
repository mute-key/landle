import * as vscode from "vscode";

import { 
    removeTrailingWhiteSpaceString,
    removeMultipleWhiteSpaceString,
    findMultipleWhiteSpaceString,
    splitStringOn,
    getNowDateTimeStamp,
    pushMessage
} from "../common/util";
import { stringify } from "querystring";

export enum LineEditType {
    APPEND = "replace",
    PREPEND = 'insert',
    REPLACE = 'replace',
    CLEAR = 'replace',
    DELETE = 'delete'
};

export class Line {
    #doc: vscode.TextDocument;
    #edit: vscode.TextEditorEdit;

    constructor() {

    }

    // =============================================================================
    // > PRIVATE FUNCTIONS: 
    // =============================================================================

    /**
     * LineNumbers and 
     * 
     * @param range 
     * @param callback 
     */
    // private iterateLines = (range: vscode.Range, callback: (range : vscode.Range) => void): void => {
    //     let cursor = range.start.line;
        
    //     while (cursor < range.end.line) {
    //         if (this.#doc.validateRange(range)) {
    //             callback(this.#doc.lineAt(cursor).range);
    //         } 
    //         cursor++;
    //     }
    // };

    // private interateSelections = (callback : (range : vscode.Range) => void): void => {
    //     this.editor?.selections.forEach((range) => {
    //         if (range.isSingleLine) {
    //             callback(range);
    //         } else {
    //             this.iterateLines(range, callback);
    //         };
    //     });
    // };

    // private interateSelectionOnly = (callback : (range : vscode.Range) => void): void => {
    //     this.editor?.selections.forEach((range) => {
    //         callback(range);
    //     });
    // };

    // need to revise if this is actually needed
    private lineRange = (range: vscode.Range): vscode.Range => {
        return this.#doc.lineAt(range.start.line).range;
    };

    private lineRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.#doc.lineAt(range.start.line).rangeIncludingLineBreak;
    };

    private deleteRange = (range: vscode.Range): void => {
        return this.#edit.delete(range);
    };

    private getText = (range: vscode.Range): string => {
        return this.#doc.getText(range);
    };

    private getTextLine = (range : vscode.Range, offset = 0): vscode.TextLine => {
        return this.#doc.lineAt(range.start.line + offset);
    };

    private clearLine = (range: vscode.Range): void => {
        this.deleteRange(this.lineRange(range));
    };

    private removeLine = (range: vscode.Range): void => {
        this.deleteRange(this.lineRangeWithEOL(range));
    };

    private ifLineIsEmpty = (textLine: vscode.TextLine): boolean => textLine.isEmptyOrWhitespace;

    private checkNextLine = (range: vscode.Range, callback: (range: vscode.Range) => void) => {
        const currentLine = this.getTextLine(range);
        const nextLine = this.getTextLine(range, 1);

        if (this.ifLineIsEmpty(currentLine) && this.ifLineIsEmpty(nextLine)) {
            callback(this.getTextLine(range).range);
        }
    };

    public getLineNumbersFromRange = (range: vscode.Range): { startLine: number, endLine: number } => {
        const startLine = range.start.line; // 시작 위치의 line number
        const endLine = range.end.line;     // 끝 위치의 line number
        return { startLine, endLine };
    };

    private Indent = () => {

    };  

    private Append = (add: string) => {

    };

    private prepend = (range : vscode.Range , insert : string) => {
        this.#edit.insert(range.start, insert);
    };

    private getLineFullRange = (range: vscode.Range): vscode.Range => {
        const currentRange = this.getLineNumbersFromRange(<vscode.Range>range);
        return this.#doc.lineAt(currentRange.startLine).range;
    };

    private setLine = (range?: vscode.Range, line?: string): void => {

        console.log(line);
        const currentRange = this.getLineNumbersFromRange(<vscode.Range>range);
        const currentLineFullRange = this.#doc.lineAt(currentRange.startLine).range;
        // currentRange.startLine.
        this.#edit.replace(currentLineFullRange, <string>line);
        // this method should replace entire string
        // if (range?.isSingleLine) {

        //     // this.#edit.delete()
        // }
        // range.start.line

    };


    // need range pass types. lets use bitmask.
    // 
    private rangeHandler = (range: vscode.Range) : vscode.Range => {
        if (range.isEmpty) {
            return this.getLineFullRange(range);
        } else {

        }

        return range;
        // if (range.is)
        // return ; 
    };

    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

    // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {
    //     return this.editor?.edit((editBuilder) => {
    //         this.#edit = editBuilder;
    //         this.interateSelections(callback);
    //     });
    // };

    // protected perSelectionEdit = (callback): vscode.ProviderResult<typeof callback> => {
    //     return this.editor?.edit((edit) => {
    //         this.#edit = edit;
    //         this.interateSelections(callback);
    //     });
    // };

    protected removeTrailingWhiteSpaceFromLine = (range: vscode.Range): void => {
        const newRange = this.getLineFullRange(range);
        const newLine = removeTrailingWhiteSpaceString(this.getText(this.getLineFullRange(range)));
        this.setLine(newRange, newLine);

        
        // this.getText(range)
        // console.log(newLine);

    };
    
    protected removeMulitpleEmptyLines = (range: vscode.Range): void => {
        this.checkNextLine(range, this.removeLine);
    };

    protected removeEmptyLines = (range: vscode.Range): void => {
        if (this.ifLineIsEmpty(this.getTextLine(range))) {
            this.removeLine(range);
        }
    };

    protected removeMultipleWhitespaceFromLine = (range : vscode.Range) : void => {        
        const textLine : vscode.TextLine = this.getTextLine(range);
        const findex : number = textLine.firstNonWhitespaceCharacterIndex;
        if (findMultipleWhiteSpaceString(textLine.text)) {
            let text : (string | string[])[]  = splitStringOn(this.getText(range), findex);
            if (Array.isArray(text) && text.length > 1) {
                this.setLine(range, <string>text[0] + removeMultipleWhiteSpaceString(<string>text[1]));
            }
        }
    };

    protected cleanUpWhitespaceFromLines = (range : vscode.Range) : void => {        
        // const findex = this.getTextLine(range).firstNonWhitespaceCharacterIndex;
        // let text = splitStringOn(this.getText(range), findex);
        // this.setLine(range,text[0] + removeMultipleWhiteSpaceString(text[1]));
    };

    protected setNowDateTimeOnLine = (range : vscode.Range) : void => {
        this.prepend(range, getNowDateTimeStamp());
    };

    /**
     * 
     * i will not implement something that formatter already can do
     * 
     * 
     * - need to check if selection is multiple lines if then, do.
     * - check the language of the current editor 
     * - if selected range is commented, join them 
     * - if selected rnage is not comment, ignore 
     * - if selection is plan text, just join them 
     * - rmeove all multiple line spaces when join  
     * 
     * @param range 
     */
    protected joinLines = (range : vscode.Range) : void => {
        // range
        // vscode.languages.getLanguages()
        const langId = vscode.window.activeTextEditor?.document.languageId;

        // if (langId !== "plaintext" && langId !== undefined) {
        //     if(range.isSingleLine)  {
        //         console.log('range.isSingleLine', range.isSingleLine);
        //     } else {
        //         console.log('range.isSingleLine', range.isSingleLine);
        //     }
        // } else {
        //     console.log('text file');
        // }



        // there are couple of things to be checked.
        // this.#doc.isUntitle
        // vscode.window.activeTextEditor?.document.languageIdd
    };


   

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    



}

