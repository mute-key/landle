import * as vscode from "vscode";
import {
    Line,
    LineType
} from "./Line";

import { LineUtil } from "../common/LineUtil";
import { 
    BaseLength, 
    ToleanceLength,
    deleteCommentAlsoDeleteBlockComment
} from "../common/config";

export interface Edithandler {
    removeTrailingWhiteSpace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    removeMultipleWhitespace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    removeMulitpleEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    removeCommentedLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    removeEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    removeDuplicateLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
    setNowDateTimeOnLine: (range: vscode.Range) => LineType.LineEditInfo | undefined
}

export class LineHandler extends Line {
    constructor() {
        super();
    }

    /**
     * check if the document is starting
     * 
     * @param range
     * @returns
     * 
     */
    public removeDocumentStartingEmptyLine = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        let lineNumber: number = range.start.line;
        if (lineNumber === 0) {
            let newTextLine : vscode.TextLine;
            let newRange : vscode.Range;
            const lineSkip : number[] = [];
            while(lineNumber < this.doc.lineCount) {
                newTextLine = this.getTextLineFromRange(lineNumber);
                if (newTextLine.isEmptyOrWhitespace) {
                    newRange = newTextLine.range;
                    lineSkip.push(lineNumber);
                    lineNumber++;
                } else {
                    break;
                }
            }
            return {
                range: new vscode.Range(
                    new vscode.Position(0, 0),
                    new vscode.Position(lineNumber, 0)
                ),
                block: {
                    lineSkip: lineSkip,
                    priority: LineType.LineEditBlockPriority.HIGH
                }
            };
        }
        return;
    };

    /**
     * remove trailing whitespace lines from range if there is non-whitespace-character present.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeTrailingWhiteSpace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textline = this.getTextLineFromRange(range);
        let whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(textline.text);
        if (LineUtil.isEmptyBlockComment(textline.text)) {
            whitespacePos += 1;
        }

        if (whitespacePos > 0) {
            const textLineLength = (textline.text.length);
            return {
                range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
            };
        }

        return;
    };

    /**
     * remove continous whitespaces that are longer than 1 from line when there is non-whitespace
     * -character present in line. this will ignore indentation and edtiing range will start from
     * fisrt non whitespace character in the line. this funciton will keep the pre-edit range
     * to overwrite with whitespaces otherwise pre-edit characters will be left in the line
     * otherwise this callback would need to perform 2 edit to achieve removing the whitespaces in
     * delta bigger than 1. resizing range will only affact to target range but not out or range.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeMultipleWhitespace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.findMultipleWhiteSpaceString(lineText) && !this.getTextLineFromRange(range).isEmptyOrWhitespace) {
            const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
            // also need to check if the line has indent
            const startPos = this.getTextLineFromRange(range).firstNonWhitespaceCharacterIndex;
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos + 1),
                string: newLineText.padEnd(endPos, " ").trim()
            };
        }
        return;
    };

    /**
     * check if the current cursor or selected range is empty line and next.
     * if both current and next is emtpy, remove current line.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeMulitpleEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        const nextLine = this.getTextLineFromRange(range, 1).isEmptyOrWhitespace;
        if (currentLine && nextLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * remove line if the line is commented
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeCommentedLine = (range: vscode.Range) : LineType.LineEditInfo | undefined => {
        const lineText = this.getText(range);
        const commentIndex = LineUtil.getlineCommentIndex(lineText);

        if (deleteCommentAlsoDeleteBlockComment) {
                
        }

        if (LineUtil.isLineCommented(lineText)) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        } else if (commentIndex !== -1) {
            return {
                range: this.newRangeZeroBased(range.start.line, commentIndex-1, lineText.length)
            };
        }
        return;
    };

    /**
     * remove line if the line is empty without characters.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeEmptyLine = (range: vscode.Range) : LineType.LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };
    
    /**
     * check if the current cursor or selected range is empty line and next.
     * if both current and next is emtpy, remove current line.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public removeDuplicateLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range);
        const nextLine = this.getTextLineFromRange(range, 1);
        if (currentLine.text === nextLine.text) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * remove empty block comment line if the previous line is block comment start
     * 
     * @param range
     * @returns
     * 
     */
    public removeEmptyBlockCommentLineOnStart = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        const currentLine : vscode.TextLine = this.getTextLineFromRange(range);
        const beforeLine : vscode.TextLine = this.getTextLineFromRange(range, -1);
        const blockCommentStart : boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

        if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
            let lineNumber : number = range.start.line;
            let newRange : vscode.Range | undefined = undefined;
            let newTextLine : vscode.TextLine;
            const lineSkip : number[] = [];
            while(lineNumber) {
                newTextLine = this.getTextLineFromRange(lineNumber);
                if (LineUtil.isEmptyBlockComment(newTextLine.text)) {
                    newRange = newTextLine.range;
                    lineSkip.push(lineNumber);
                    lineNumber++;
                } else {
                    break;
                }
            }
            if (newRange) {
                return {
                    range: new vscode.Range(
                        new vscode.Position(range.start.line, 0),
                        new vscode.Position(lineNumber, 0)
                    ),
                    block : {
                        priority: LineType.LineEditBlockPriority.MID,
                        lineSkip: lineSkip
                    }
                };
            }
        }
        return;
    };

    /**
     * remove current empty block comment line if next line is also
     * empty block comment line.
     * 
     * @param range
     * @returns
     * 
     */
    public removeMultipleEmptyBlockCommentLine = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        const currentLine : vscode.TextLine = this.getTextLineFromRange(range);
        const nextLine : vscode.TextLine = this.getTextLineFromRange(range, 1);
        const nextLineIsBlockCommend : boolean = LineUtil.isEmptyBlockComment(nextLine.text);
        const LineIsBlockCommend : boolean = LineUtil.isEmptyBlockComment(currentLine.text);
        const beforeLine : vscode.TextLine = this.getTextLineFromRange(range, -1);
        const blockCommentStart : boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

        if (LineIsBlockCommend && nextLineIsBlockCommend && !blockCommentStart) {
            return {
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * insert empty block comment line if next line is block comment end
     * 
     * @param range
     * @returns
     * 
     */
    public insertEmptyBlockCommentLineOnEnd = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        const EOL = this.getEndofLine();
        const currentLine : vscode.TextLine = this.getTextLineFromRange(range);
        const nextLine : vscode.TextLine = this.getTextLineFromRange(range, 1);
        const NextLineblockCommentEnd : boolean = LineUtil.isBlockCommentEndingLine(nextLine.text);

        if (NextLineblockCommentEnd && LineUtil.isBlockComment(currentLine.text)) {
            return {
                range: this.newRangeZeroBased(range.start.line, currentLine.text.length, currentLine.text.length),
                string: EOL + LineUtil.cleanBlockComment(currentLine.text) + " "
            };
        }
        return;
    };

    /**
     * funciton removes empty-lines next block-comment lines.
     * 
     * @param range range of the line.
     * @returns LineEditInfo or undefined
     * 
     */
    public removeEmptyLinesBetweenBlockCommantAndCode = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        const currentTextLine = this.getTextLineFromRange(range);
        const previousTextLine = this.getTextLineFromRange(range, -1);
        if (currentTextLine.isEmptyOrWhitespace && LineUtil.isBlockCommentEndingLine(previousTextLine.text)) {
            let lineNumber: number = range.start.line;
            let newTextLine : vscode.TextLine;
            const lineSkip : number[] = [];
            while(lineNumber < this.doc.lineCount) {
                newTextLine = this.getTextLineFromRange(lineNumber);
                if (newTextLine.isEmptyOrWhitespace) {
                    lineSkip.push(lineNumber);
                    lineNumber++;
                } else {
                    break;
                }
            }
            return {
                range: new vscode.Range(
                    new vscode.Position(range.start.line, 0),
                    new vscode.Position(lineNumber, 0)
                ),
                block: {
                    lineSkip: lineSkip,
                    priority: LineType.LineEditBlockPriority.HIGH
                }
            };
        }
        return;
    };

    /**
     * this function needs to do 2 edit, 1 is to add new string at position 0,0
     * and delete rest of the un-justified strings. 
     * 
     * @param range 
     * @returns 
     */
    public blockCommentWordCountJustifyAlign = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        
        const currentTextLine : vscode.TextLine = this.getTextLineFromRange(range);
        let lineTextInArray : string[] = [];

        if (LineUtil.isBlockComment(currentTextLine.text) && !LineUtil.isJSdocTag(currentTextLine.text)) {
            const indentIndex = currentTextLine.text.indexOf("*");
            const indentString = currentTextLine.text.substring(0, indentIndex + 1);
        
            if (currentTextLine.text.length < (BaseLength - ToleanceLength) || currentTextLine.text.length > (BaseLength + ToleanceLength)) {
                
                let lineNumber: number = range.start.line;
                let newTextLine : vscode.TextLine;
                const lineSkip : number[] = [];

                while(lineNumber < this.doc.lineCount) {
                    newTextLine = this.getTextLineFromRange(lineNumber);
                    if (LineUtil.isJSdocTag(newTextLine.text)) {
                        break;
                    }

                    if (LineUtil.isBlockComment(newTextLine.text)) {
                        lineTextInArray.push(...newTextLine.text.trim().replaceAll("*", "").split(/\s+/));
                        lineSkip.push(lineNumber);
                        lineNumber++;
                    } else {
                        lineTextInArray.push(this.getEndofLine() + indentString);
                        break;
                    }
                }

                let newString : string = " ";
                let lineCharacterCount = 0;

                for (const str of lineTextInArray) {
                    if (str.length > 0) {
                        newString += str + " "; 
                        lineCharacterCount += str.length + 1;
                        if (lineCharacterCount > (BaseLength - indentString.length)) {
                            newString += this.getEndofLine() + indentString + " ";
                            lineCharacterCount = 0;
                        }
                    }
                }

                return {
                    range: new vscode.Range(
                        new vscode.Position(range.start.line, indentString.length),
                        new vscode.Position(lineNumber, indentString.length)
                    ),
                    type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
                    string: newString,
                    block: {
                        lineSkip: lineSkip,
                        priority: LineType.LineEditBlockPriority.HIGH
                    }
                };
            } 
        }
        return;
    };

    /**
     * funciton to print current datetime where the cursor is.
     * - locale
     * - iso
     * - custom
     * 
     * @param range target range, whichi will be the very starting of line.
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public setNowDateTimeOnLine = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        return {
            range: range,
            string: LineUtil.getNowDateTimeStamp.custom()
        };
    };
}