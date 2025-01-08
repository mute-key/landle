import * as vscode from "vscode";

import { LineUtil } from "../common/util";

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

export type LineEditCallbackReturnType = LineEditInfo | undefined;


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

    private getText = (range: vscode.Range): string => {
        return this.#doc.getText(range);
    };

    private getTextLineOrRange = (range: vscode.Range | number, offset = 0): vscode.TextLine => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range + offset);
        }

        if (this.#doc.lineCount > range.start.line + offset) {
            return this.#doc.lineAt(range.start.line + offset);
        } 

        return this.#doc.lineAt(range.start.line);               
    };

    private lineFullRange = (range: vscode.Range | number): vscode.Range => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range).range;
        }
        return this.#doc.lineAt(range.start.line).range;
    };

    private lineFullRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.getTextLineOrRange(range).rangeIncludingLineBreak;
    };

    
    private getLineNumbersFromRange = (range: vscode.Range): { startLine: number, endLine: number } => {
        const startLine = range.start.line; 
        const endLine = range.end.line;     
        return { startLine, endLine };
    };

    private newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
        return new vscode.Range(
            new vscode.Position(lineNuber, startPosition),
            new vscode.Position(lineNuber, endPosition)
        );
    };

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

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
            const currentRange = this.lineFullRange(currentLineNumber);
            if (!Array.isArray(callback)) {
                const newLineObject : LineEditCallbackReturnType = callback.func(this.lineFullRange(currentLineNumber));
                if (newLineObject) {
                    editList.push({
                        ...newLineObject,
                        type: callback.type
                    });
                }
            } else {
                callback.forEach((fnPerLine) => {
                    const newLineObject: LineEditCallbackReturnType = fnPerLine.func(this.lineFullRange(currentLineNumber));
                    if (newLineObject) {
                        editList.push({
                            ...newLineObject,
                            type: fnPerLine.type
                        });
                    }
                });
            }
            currentLineNumber++;
        }
        return editList;
    };


    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

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
            const startPos = this.getTextLineOrRange(range).firstNonWhitespaceCharacterIndex;
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos),
                string: newLineText
            };
        }
        return;
    };

    public removeMulitpleEmptyLines = (range: vscode.Range): LineEditInfo | undefined => {
        const currentLine = this.getTextLineOrRange(range).isEmptyOrWhitespace;
        const nextLine = this.getTextLineOrRange(range, 1).isEmptyOrWhitespace;

        if (currentLine && nextLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    public removeCommentedLine = (range: vscode.Range) : LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.isLineCommented(lineText)) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    public removeEmptyLines = (range: vscode.Range) : LineEditInfo | undefined => {
        const currentLine = this.getTextLineOrRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return; 
    };

    public setNowDateTimeOnLine = (range : vscode.Range) : LineEditInfo | undefined => {
        return {
            range: range,
            string: LineUtil.getNowDateTimeStamp()
        };;
    };    
}

