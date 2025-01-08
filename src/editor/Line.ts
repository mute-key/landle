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

export type LineEditDefintion = {
    func: (any) => LineEditInfo,
    type: LineEditType,
    cond?: number
}

export type LineEditCallbackReturnType = LineEditInfo | undefined;

type NewLineCallback = {
    range: vscode.Range,
    string?: string
}

export type IterateLineType = NewLineCallback | NewLineCallback[] | void;

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

    private lineFullRange = (range: vscode.Range | number): vscode.Range => {
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

    
    private newLineEditCallbackWrapper = (currntRange : vscode.Range, fn: LineEditDefintion, editList : IterateLineType[], cond: boolean = true) : void => {
        const editInfo : NewLineCallback = fn.func(currntRange);
        if (editInfo && cond) {
            editList.push(<LineEditInfo>{
                ...editInfo,
                type: fn.type
            });
        }
    };

    private lineRecursion = (range : vscode.Range, callback: LineEditDefintion[], currentLineNumber : number, editList: IterateLineType[]) : IterateLineType[] => {
        const currntRange : vscode.Range = this.lineFullRange(currentLineNumber);
        if (currentLineNumber < range.end.line) {
            callback.forEach(fn => this.newLineEditCallbackWrapper(currntRange, fn, editList));
            this.lineRecursion(range, callback, currentLineNumber + 1, editList);
        }
        return editList;
    };
    
    public prepareLines = (range: vscode.Range, callback: LineEditDefintion[]): IterateLineType[] => {
        // <IterateLineType[]>[]
        const lineEdit : IterateLineType[] = [];

        // on each selection, starting line is: isEmpty
        if (range.isEmpty) {
            
            callback.forEach(fn => this.newLineEditCallbackWrapper(range, fn, lineEdit, range.isEmpty));
            return lineEdit;
        }

        // on each selection, starting line is: isSingleLine
        if (range.isSingleLine) {
            callback.forEach(fn => this.newLineEditCallbackWrapper(range, fn, lineEdit, range.isSingleLine));
            return lineEdit;
        }

        return this.lineRecursion(
            range, 
            callback, 
            range.start.line, 
            lineEdit);
    };


    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

    public removeTrailingWhiteSpaceFromLine = (range: vscode.Range): NewLineCallback | undefined => {
        const whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(this.getText(range));
        if (whitespacePos >= 0) {
            const textLineLength = (this.getText(range).length);
            return {
                range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
            };
        } 
        return;
    };

    public removeMultipleWhitespaceFromLine = (range: vscode.Range): NewLineCallback | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.findMultipleWhiteSpaceString(lineText)) {
            const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
            const startPos = this.getTextLineFromRange(range).firstNonWhitespaceCharacterIndex;
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos),
                string: newLineText
            };
        }
        return;
    };

    public removeMulitpleEmptyLines = (range: vscode.Range): NewLineCallback | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        const nextLine = this.getTextLineFromRange(range, 1).isEmptyOrWhitespace;

        if (currentLine && nextLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    public removeCommentedLine = (range: vscode.Range) : NewLineCallback | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.isLineCommented(lineText)) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    public removeEmptyLines = (range: vscode.Range) : NewLineCallback | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return; 
    };

    public setNowDateTimeOnLine = (range : vscode.Range) : NewLineCallback | undefined => {
        return {
            range: range,
            string: LineUtil.getNowDateTimeStamp()
        };;
    };    
}

