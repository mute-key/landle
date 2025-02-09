import * as vscode from "vscode";
import {
    Line
} from "../Collection/Line";
import { LineType } from "../../type/LineType";
import { LineUtil } from "../../common/Util";
import { config } from "../../common/config";
import { BaseHandler } from "./BaseHandler";

// export interface Edithandler {
//     removeTrailingWhiteSpace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeMultipleWhitespace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeMulitpleEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeCommentedLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeDuplicateLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     setNowDateTimeOnLine: (range: vscode.Range) => LineType.LineEditInfo | undefined
// }

export abstract class LineHandler extends BaseHandler {
    /**
     * check if the document is starting with empty line and removes them.
     * 
     * @param range
     * @returns
     * 
     */
    public static removeDocumentStartingEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        let lineNumber: number = range.start.line;
        if (lineNumber === 0) {
            const lineIteration = Line.iterateNextLine(range, (line: string) => line.trim().length === 0);
            if (lineIteration) {
                return {
                    name: 'removeDocumentStartingEmptyLine',
                    range: new vscode.Range(
                        new vscode.Position(0, 0),
                        new vscode.Position(lineIteration.lineNumber, 0)
                    ),
                    block: {
                        lineSkip: lineIteration.lineSkip,
                        priority: LineType.LineEditBlockPriority.HIGH
                    }
                };
            }
        }
        return;
    };

    /**
     * remove trailing whitespace lines from range if there is non-whitespace-character 
     * present.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public static removeTrailingWhiteSpace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textline = Line.getTextLineFromRange(range);
        let whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(textline.text);
        let endPos: number = textline.text.length;
        if (LineUtil.isEmptyBlockComment(textline.text)) {
            if (whitespacePos < 0) {
                return;
            } else {
                // console.log(whitespacePos, (textline.text.indexOf("*") + 1))
                if (whitespacePos === (textline.text.indexOf("*") + 1)) {
                    return;
                }
            }

            whitespacePos += 1;
        }

        if ((whitespacePos > 0 && textline.text.length >= whitespacePos + 1) && textline.text.length > 0 && !textline.isEmptyOrWhitespace) {
            return {
                name: 'removeTrailingWhiteSpace',
                range: Line.newRangeZeroBased(range.start.line, whitespacePos, endPos)
            };
        }
        return;
    };

    /**
     * remove continous whitespaces that are longer than 1 from line when
     * there is non-whitespace -character present in line. this will ignore
     * indentation and edtiing range will start from fisrt non whitespace
     * character in the line. this funciton will keep the pre-edit range
     * to overwrite with whitespaces otherwise pre-edit characters will
     * be left in the line otherwise this callback would need to perform
     * two edit to achieve removing the whitespaces in delta bigger than
     * 1. resizing range will only affact to target range but not out or
     * range.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public static removeMultipleWhitespace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textLine = Line.getTextLineFromRange(range);
        let startPosition = textLine.firstNonWhitespaceCharacterIndex;

        if (LineUtil.isMultipleWhiteSpace(textLine.text) && !textLine.isEmptyOrWhitespace) {

            const newLineText = textLine.text.trim();
            let stringLiteral = false;
            const length = newLineText.length;
            let i = 0;
            let result = '';
            let lineComment: RegExpExecArray | null = LineUtil.lineCommentWithWhitespace(newLineText);

            if (LineUtil.isBlockCommentWithCharacter(textLine.text)) {
                startPosition = textLine.text.indexOf('*');
            }

            const commentOnly = LineUtil.findCommentOnlyIndenetAndWhitespace(textLine.text);
            if (commentOnly) {
                // if (config.of.removeWhitespaceOflineComment) {
                // i += commentOnly[1].length;
                // startPosition += commentOnly[1].length;
                // }
                return;
            }

            while (i++ < length) {
                const char: string = newLineText[i - 1];
                const isQuote = (char === '"' || char === "'");
                if (isQuote) {
                    stringLiteral = !stringLiteral;
                }

                if (isQuote || stringLiteral) {
                    result += char;
                    continue;
                }

                const previous = newLineText[i];
                if (char === ' ' && previous === ' ') {
                    if (lineComment) {
                        if (lineComment.length > 0 && !config.of.removeWhitespaceBeforeInlineComment) {
                            const commentLength = lineComment[0].length;
                            i += commentLength - 1;
                            result += lineComment[0];
                            lineComment = <RegExpExecArray>lineComment.filter((value, index) => index !== 0);
                        }
                    }
                    continue;
                } else {
                    result += char;
                }
            }

            if (textLine.text !== result.padStart(startPosition + result.length, ' ')) {
                return {
                    name: 'removeMultipleWhitespace',
                    range: Line.newRangeZeroBased(
                        range.start.line,
                        startPosition,
                        textLine.text.length
                    ),
                    string: result
                };
            }
        }
        return;
    };

    /**
     * check if the current cursor or selected range is empty line and
     * next. if both current and next is emtpy, remove current line.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public static removeMulitpleEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const previousLine = Line.getTextLineFromRange(range, -1);
        const currentLine = Line.getTextLineFromRange(range);
        if (range.end.line <= this.editor.document.lineCount && range.start.line > 0) {
            const nextLine = Line.getTextLineFromRange(range, 1);

            if (currentLine.isEmptyOrWhitespace && nextLine.isEmptyOrWhitespace && !LineUtil.isBlockComment(previousLine.text)) {
                return {
                    name: 'removeMulitpleEmptyLine',
                    range: new vscode.Range(
                        new vscode.Position(range.start.line - 1, previousLine.text.length),
                        new vscode.Position(range.start.line, 0)
                    )
                };
            }
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
    public static removeCommentedLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const lineText = Line.getText(range);
        const commentIndex = LineUtil.getlineCommentIndex(lineText);

        // if (deleteCommentAlsoDeleteBlockComment) {
        // if (LineUtil.isBlockCommentStartingLine(lineText)) {

        // }

        // if (LineUtil.isBlockCommentWithCharacter(lineText)) {

        // }

        // if (LineUtil.isBlockCommentEndingLine(lineText)) {

        // }
        // }

        if (LineUtil.isCommentOnlyLine(lineText)) {
            return {
                name: 'removeCommentedLine',
                range: Line.lineFullRangeWithEOL(range)
            };
        } else if (commentIndex !== -1) {
            return {
                name: 'removeCommentedLine',
                range: Line.newRangeZeroBased(range.start.line, commentIndex - 1, lineText.length)
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
    public static removeEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = Line.getTextLineFromRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                name: 'removeEmptyLine',
                range: Line.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * check if the current cursor or selected range is empty line and
     * next. if both current and next is emtpy, remove current line.
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     * 
     */
    public static removeDuplicateLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = Line.getTextLineFromRange(range);
        const nextLine = Line.getTextLineFromRange(range, 1);
        if (currentLine.text === nextLine.text) {
            return {
                name: 'removeDuplicateLine',
                range: Line.lineFullRangeWithEOL(range)
            };
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
    public static setNowDateTimeOnLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        return {
            name: 'setNowDateTimeOnLine',
            range: range,
            string: LineUtil.getNowDateTimeStamp.custom()
        };
    };
}