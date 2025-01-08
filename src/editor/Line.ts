import * as vscode from "vscode";

import { LineUtil } from "../common/util";
import { emit } from "process";

export enum LineEditTypeChecker {
    DEFAULT = 0b0001,
    CURSOR_ONLY_ALLOWED = 0b0010,
    SINGLE_LINE_ONLY_ALLOWED = 0b0100,
    EMPTY_LINE_ALLOWED = 0b1000,
}

export enum LineEditType {
    APPEND = 0b00000001,
    PREPEND = 0b00000010,
    REPLACE = 0b00000100,
    CLEAR = 0b00001000,
    DELETE = 0b00100000
};

export type LineEditInfo = {
    range: vscode.Range,
    string?: string,
    type?: LineEditType
}

export type LineEditCallback = {
    func: (any) => LineEditInfo,
    type: LineEditType,
    cond?: number
}


type NewLine = {
    range: vscode.Range,
    string?: string
}

export type IterateLineType = NewLine | NewLine[] | void;

export class Line {
    #doc: vscode.TextDocument;
    #edit: vscode.TextEditorEdit;
    #editor: vscode.TextEditor | undefined;



    constructor() {
        this.#editor = vscode.window.activeTextEditor;
        if (!this.#editor) {
            LineUtil.pushMessage("No Active Editor");
            return;
        } else {
            this.#doc = this.#editor.document;
        }
    }

    // =============================================================================
    // > PRIVATE FUNCTIONS: 
    // =============================================================================


    private getTextLineOrRange = (range: vscode.Range | number, offset = 0): vscode.TextLine => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range + offset);
        }
        return this.#doc.lineAt(range.start.line + offset);
    };

    public lineFullRange = (range: vscode.Range | number): vscode.Range => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range).range;
        }
        return this.#doc.lineAt(range.start.line).range;
    };

    private lineFullRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.#doc.lineAt(range.start.line).rangeIncludingLineBreak;
    };

    /**
     * LineNumbers and 
     * 
     * @param range 
     * @param callback 
     */
    // Promise<string>[]
    public prepareLines = (editor, range: vscode.Range, callback: LineEditCallback | LineEditCallback[]): IterateLineType[] => {

        const editList: any[] = [];
        if (range.isEmpty) {
            if (!Array.isArray(callback)) {
                return [<LineEditInfo>{
                    ...callback.func(this.lineFullRange(range)),
                    type: callback.type
                }];
            }
        }

        if (range.isSingleLine) {
            if (!Array.isArray(callback)) {
                return [<LineEditInfo>{
                    ...callback.func(this.lineFullRange(range)),
                    type: callback.type
                }];
            }
        }

        let currentLineNumber = range.start.line;
        while (currentLineNumber <= range.end.line) {
            if (!Array.isArray(callback)) {
                const newLineObject = callback.func(this.lineFullRange(currentLineNumber));
                if (newLineObject !== undefined) {
                    // this.lineFullRange(currentLineNumber);
                    editList.push({
                        ...newLineObject,
                        type: callback.type
                    });
                }
            } else {
                let refreshRange : vscode.Range = this.lineFullRange(currentLineNumber);
                callback.forEach((fnPerLine) => {
                    const line: any = fnPerLine.func(refreshRange);
                    if (line) {
                        editList.push({
                            ...line,
                            type: fnPerLine.type
                        });
                        refreshRange = this.lineFullRange(currentLineNumber)
                    }
                    // console.log("line ", line.string);
                    // fnPerLine.func()
                });

                // const newLineObject = callback.func(this.lineFullRange(currentLineNumber));

            }
            currentLineNumber++;
        }

        return editList;
    };


    private deleteRange = (range: vscode.Range): void => {
        return this.#edit.delete(range);
    };

    private getText = (range: vscode.Range): string => {
        return this.#doc.getText(range);
    };

    private getTextLine = (range: vscode.Range, offset = 0): vscode.TextLine => {
        return this.#doc.lineAt(range.start.line + offset);
    };

    private clearLine = (range: vscode.Range): void => {
        this.deleteRange(this.lineFullRange(range));
    };

    private removeLine = (range: vscode.Range): void => {
        this.deleteRange(this.lineFullRangeWithEOL(range));
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

    private prepend = (range: vscode.Range, insert: string) => {
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
    private rangeHandler = (range: vscode.Range): vscode.Range => {
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

    public newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
        return new vscode.Range(
            new vscode.Position(lineNuber, startPosition),
            new vscode.Position(lineNuber, endPosition)
        );
    };

    public removeTrailingWhiteSpaceFromLine = (range: vscode.Range): LineEditInfo | undefined => {
        const whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(this.getText(range));
        if (whitespacePos >= 0) {
            const textLineLength = (this.getText(range).length);
            return {
                range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
            };
        } 
        return;
    };

    public removeMultipleWhitespaceFromLine = (range: vscode.Range): LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.findMultipleWhiteSpaceString(lineText)) {
            const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);


            console.log('newLineText', newLineText)
            // newLineText.
            const startPos = this.getTextLine(range).firstNonWhitespaceCharacterIndex
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos),
                string: newLineText
            };
        }
        return;
    };


    protected removeMulitpleEmptyLines = (range: vscode.Range): void => {
        this.checkNextLine(range, this.removeLine);
    };

    protected removeEmptyLines = (range: vscode.Range): void => {
        if (this.ifLineIsEmpty(this.getTextLine(range))) {
            this.removeLine(range);
        }
    };

    protected cleanUpWhitespaceFromLines = (range: vscode.Range): void => {
        // const findex = this.getTextLine(range).firstNonWhitespaceCharacterIndex;
        // let text = splitStringOn(this.getText(range), findex);
        // this.setLine(range,text[0] + removeMultipleWhiteSpaceString(text[1]));
    };

    // protected setNowDateTimeOnLine = (range : vscode.Range) : void => {
    //     this.prepend(range, getNowDateTimeStamp());
    // };

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
    protected joinLines = (range: vscode.Range): void => {
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

