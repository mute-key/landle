import * as vscode from "vscode";

import { LineUtil } from "../common/LineUtil";

export enum LineEditCollisionGroup {
    DEFAULT = 0b0000,
    NO_RANGE_OVERLAPPING = 0b0001,
    IGNORE_ON_COLLISION = 0b0010,
    PRIORITY = 0b0100,
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

export type LineEditDefintion = {
    func: (range) => LineEditInfo,
    type: LineEditType,
    cond?: number
}

export type IterateLineType = LineEditInfo | LineEditInfo[] | void;

export type LineEditCallbackReturnType = LineEditInfo | undefined;

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

    private getTextLineFromRange = (range: vscode.Range | number, lineDelta = 0): vscode.TextLine => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range + lineDelta);
        }

        if (this.#doc.lineCount > range.start.line + lineDelta) {
            return this.#doc.lineAt(range.start.line + lineDelta);
        } 

        return this.#doc.lineAt(range.start.line);               
    };

    protected lineFullRange = (range: vscode.Range | number): vscode.Range => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range).range;
        }
        return this.#doc.lineAt(range.start.line).range;
    };

    private lineFullRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.getTextLineFromRange(range).rangeIncludingLineBreak;
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

    private editLineBindOnCondition = (range : vscode.Range, callback : LineEditDefintion, cond: boolean) : LineEditInfo | undefined => {
        return cond ? <LineEditInfo>{
            ...callback.func(this.lineFullRange(range)),
            type: callback.type
        } : undefined;
    };

    private editedLineInfo = (currntRange: vscode.Range, fn: LineEditDefintion, _lineEdit_: IterateLineType[]): void => {
        const editInfo: LineEditInfo = fn.func(currntRange);
        if (editInfo) {
            _lineEdit_.push(<LineEditInfo>{
                ...editInfo,
                type: fn.type
            });
        }
    };
    
    private lineRecursion = (range: vscode.Range, callback: LineEditDefintion[], currentLineNumber: number, _lineEdit_: IterateLineType[]): IterateLineType[] => {
        if (currentLineNumber < range.end.line) {
            callback.forEach((fn : LineEditDefintion) => {
                <void>this.editedLineInfo(this.lineFullRange(currentLineNumber), fn, _lineEdit_);
            });
            this.lineRecursion(range, callback, currentLineNumber + 1, _lineEdit_);
        } 
        return _lineEdit_;
    };
    
    public prepareLines = (range: vscode.Range, callback: LineEditDefintion[]): IterateLineType[] => {
        const _lineEdit_: IterateLineType[] = [];
        
        // on each selection, starting line is: isEmpty or if selection is singleLine 
        if (range.isEmpty || range.isSingleLine) {
            callback.forEach(fn => <void>this.editedLineInfo(this.lineFullRangeWithEOL(range), fn, _lineEdit_));
            return _lineEdit_;
        }

        return this.lineRecursion(
            range,
            callback,
            range.start.line,
            _lineEdit_);
    };

    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

    public removeTrailingWhiteSpace = (range: vscode.Range): LineEditInfo | undefined => {
        const whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(this.getText(range));
        if (whitespacePos >= 0 && !this.getTextLineFromRange(range).isEmptyOrWhitespace) {
            const textLineLength = (this.getText(range).length);
            return {
                range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
            };
        } 
        return;
    };

    public removeMultipleWhitespace = (range: vscode.Range): LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.findMultipleWhiteSpaceString(lineText)) {
            const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
            const startPos = this.getTextLineFromRange(range).firstNonWhitespaceCharacterIndex;
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos),
                string: newLineText.padEnd(endPos, " ").trim()
            };
        }
        return;
    };

    public removeMulitpleEmptyLine = (range: vscode.Range): LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        const nextLine = this.getTextLineFromRange(range, 1).isEmptyOrWhitespace;

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
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
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

