import * as vscode from "vscode";
import { LineType } from "../../type/LineType";

/**
 * class handles the lines and range in editor
 *
 */
export abstract class Line {
    protected static doc: vscode.TextDocument;
    protected static editor: vscode.TextEditor;

    // constructor() {
        
    // }

    // =============================================================================
    // > PRIVATE FUNCTIONS:
    // =============================================================================

    /**
     * unused. for future reference.
     *
     * @param range unused
     * @returns unused
     *
     */
    #getLineNumbersFromRange = (range: vscode.Range): { startLine: number, endLine: number } => {
        const startLine = range.start.line;
        const endLine = range.end.line;
        return { startLine, endLine };
    };

    /**
     * unused. staple for future reference.
     *
     * @param range unused
     * @returns unused
     *
     */
    #editLineBindOnCondition = (range: vscode.Range, callback: LineType.LineEditDefintion, cond: boolean): LineType.LineEditInfo | undefined => {
        return cond ? <LineType.LineEditInfo>{
            ...callback.func(Line.lineFullRange(range)),
            type: callback.type
        } : undefined;
    };
    
    // =============================================================================
    // > PROTECTED FUNCTIONS:
    // =============================================================================

    public static set setCurrentDocument(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    /**
     * get EOL of current document set
     *
     * @returns
     *
     */
    public static getEndofLine = () => this.editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";

    /**
     * get text as string from range
     *
     * @param range target range
     * @returns text as string
     *
     */
    public static getText = (range: vscode.Range): string => {
        return this.editor.document.getText(range);
    };

    /**
     * get TextLine object from range or from line number.
     *
     * @param range target range
     * @returns TextLine object of range or line.
     *
     */
    public static getTextLineFromRange = (range: vscode.Range | number, lineDelta = 0): vscode.TextLine => {
        if (typeof range === 'number') {
            if (range + lineDelta >= this.editor.document.lineCount) {
                return this.editor.document.lineAt(range);
            }
            return this.editor.document.lineAt(range + lineDelta);
        }

        if ((range.start.line + lineDelta) < 0) {
            return this.editor.document.lineAt(range.start.line);
        }

        if (this.editor.document.lineCount > (range.start.line + lineDelta)) {
            return this.editor.document.lineAt(range.start.line + lineDelta);
        }

        return this.editor.document.lineAt(range.start.line);
    };

    /**
     * get the range of entire line including EOL.
     *
     * @param range target range
     * @returns
     *
     */
    public static lineFullRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.getTextLineFromRange(range).rangeIncludingLineBreak;
    };

    /**
     * create new range with line number, starting position and end position
     *
     * @param lineNuber line number of new range object
     * @param startPosition starting position of range
     * @param endPosition end position of range
     * @returns
     *
     */
    public static newRangeZeroBased = (lineNuber: number, startPosition: number, endPosition: number): vscode.Range => {
        return new vscode.Range(
            new vscode.Position(lineNuber, startPosition),
            new vscode.Position(lineNuber, endPosition)
        );
    };

    public static iterateNextLine = (
        range: vscode.Range,
        lineCondition: (line: string) => boolean,
        continueCheck?: (line: string) => boolean,
        trueConditionTask?: (line: string) => void,
        lineModifiyTask?: (line: string) => string,
    ): LineType.IterateNextLineType | undefined => {

        let lineNumber: number = range.start.line;
        let currTextLine: string;
        let condition: boolean = true;
        let lineMod : string | undefined = '';
        const lineSkip: number[] = [];
        const lineCount: number = this.editor.document.lineCount;

        while (lineNumber < lineCount) {
            
            currTextLine = this.getTextLineFromRange(lineNumber).text;
            lineMod = lineModifiyTask?.(currTextLine);

            if (lineMod) {
                currTextLine = lineMod;
            }
            
            // condition check
            if (typeof lineCondition === "function") {
                condition = lineCondition(currTextLine);
            }

            if (!condition) {
                break;
            } else {
                
            }

            lineSkip.push(lineNumber);
            lineNumber++;

            if (continueCheck?.(currTextLine)) {
                continue;
            }

            trueConditionTask?.(currTextLine);
        };

        return (lineSkip.length > 0) ? {
            lineNumber: lineNumber,
            lineSkip: lineSkip
        } : undefined ;
    };

    public static checkIfRangeTextIsEqual = (range: vscode.Range, newText: string): boolean => {
        return this.editor.document.getText(range) === newText;
    };
    // =============================================================================
    // > PUBLIC static FUNCTIONS:
    // =============================================================================

    /**
     * get the range of line with any characters including whitespaces.
     *
     * @param range vscode.Range | number.
     * @returns first line of the range or whole line of the the line number.
     *
     */
    public static lineFullRange = (range: vscode.Range | number): vscode.Range => {
        if (typeof range === 'number') {
            return this.editor.document.lineAt(<number>range).range;
        }
        return this.editor.document.lineAt(range.start.line).range;
    };

    public static rangeKind = (range: vscode.Range,): LineType.RangeKind => {
        if (range.isEmpty || range.isSingleLine) {
            return LineType.RangeKind.LINE;
        }

        if (range.start.line === 0 && range.end.line === this.editor.document.lineCount) {
            return LineType.RangeKind.DOCUMENT;
        }

        return LineType.RangeKind.MULTILINE;
    };

    /**
     * @returns
     *
     */
    // public setCurrentDocument = (editor: vscode.TextEditor): void => {
    // this.editor = editor;
    // this.editor.document = this.editor.document;
    // };
}