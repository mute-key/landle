import * as vscode from "vscode";

import { removeTrailingWhiteSpaceString } from "../common/util";
import { pushMessage, DateStamp } from "../common/util";

export class Line {
    #doc: vscode.TextDocument;
    #edit: vscode.TextEditorEdit;

    protected readonly editor: vscode.TextEditor | undefined;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
        if (!this.editor) {
            pushMessage("No Active Editor");
            return;
        }
        this.#doc = this.editor.document;
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
    private iterateLines = (range: vscode.Range, callback: (range : vscode.Range) => void): void => {
        let cursor = range.start.line;
        
        while (cursor <= range.end.line) {
            if (this.#doc.validateRange(range)) {
                callback(this.#doc.lineAt(cursor).range);
            } 
            cursor++;
        }
    };

    private interateSelectionLines = (callback : (range : vscode.Range) => void): void => {
        this.editor?.selections.forEach((range) => {
            if (range.isSingleLine) {
                callback(range);
            } else {
                this.iterateLines(range, callback);
            };
        });
    };

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

    private setLine = (range: vscode.Range, line: string): void => {
        this.#edit.replace(range, line);
    };

    private ifLineIsEmpty = (textLine: vscode.TextLine): boolean => textLine.isEmptyOrWhitespace;

    private checkNextLine = (range: vscode.Range, callback: (range: vscode.Range) => void) => {
        const currentLine = this.getTextLine(range);
        const nextLine = this.getTextLine(range, 1);

        if (this.ifLineIsEmpty(currentLine) && this.ifLineIsEmpty(nextLine)) {
            callback(this.getTextLine(range).range);
        }
    };

    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

    protected editorEdit = (callback): void => {
        this.editor?.edit((edit) => {
            this.#edit = edit;
            this.interateSelectionLines(callback);
        });
    };

    protected removeTrailingWhiteSpaceFromLine = (range: vscode.Range): void => {
        this.setLine(range, removeTrailingWhiteSpaceString(this.getText(range)));
    };
    
    protected removeMulitpleEmptyLines = (range: vscode.Range): void => {
        this.checkNextLine(range, this.removeLine);
    };

    protected removeEmptyLines = (range: vscode.Range): void => {
        if (this.ifLineIsEmpty(this.getTextLine(range))) {
            this.removeLine(range);
        }
    };

    protected Indent = () => {

    };

    protected Append = (add: string) => {

    };

    protected prepend = (add: string) => {

    };

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    // this class prob do not need public functions maybe. 

}

