// import * as vscode from "vscode";
// import {
//     Line,
//     LineType
// } from "./Line";
// import { LineUtil } from "../../common/LineUtil";
// import { config } from "../../common/config";

// export interface Edithandler {
//     removeTrailingWhiteSpace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeMultipleWhitespace: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeMulitpleEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeCommentedLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeEmptyLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     removeDuplicateLine: (range: vscode.Range) => LineType.LineEditInfo | undefined,
//     setNowDateTimeOnLine: (range: vscode.Range) => LineType.LineEditInfo | undefined
// }

// export class LineHandler extends Line {
//     constructor() {
//         super();
//     }

//     /**
//      * check if the document is starting with empty line and removes them.
//      *
//      * @param range
//      * @returns
//      *
//      */
//     public removeDocumentStartingEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         let lineNumber: number = range.start.line;
//         if (lineNumber === 0) {
//             const lineIteration = this.iterateNextLine(range, "isEmptyOrWhitespace");
//             if (lineIteration) {
//                 return {
//                     name: 'removeDocumentStartingEmptyLine',
//                     range: new vscode.Range(
//                         new vscode.Position(0, 0),
//                         new vscode.Position(lineIteration.lineNumber, 0)
//                     ),
//                     block: {
//                         lineSkip: lineIteration.lineSkip,
//                         priority: LineType.LineEditBlockPriority.HIGH
//                     }
//                 };
//             }
//         }
//         return;
//     };

//     /**
//      * remove trailing whitespace lines from range if there is
//      *
//      * non-whitespace-character present.
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeTrailingWhiteSpace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const textline = this.getTextLineFromRange(range);
//         let whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(textline.text);
//         if (LineUtil.isEmptyBlockComment(textline.text)) {
//             whitespacePos += 1;
//         }

//         if ((whitespacePos > 0 && textline.text.length >= whitespacePos + 1) && textline.text.length > 0 && !textline.isEmptyOrWhitespace) {
//             const textLineLength = (textline.text.length);
//             return {
//                 name: 'removeTrailingWhiteSpace',
//                 range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
//             };
//         }

//         return;
//     };

//     /**
//      * remove continous whitespaces that are longer than 1 from line when
//      * there is non-whitespace -character present in line. this will ignore
//      * indentation and edtiing range will start from fisrt non whitespace
//      * character in the line. this funciton will keep the pre-edit range
//      * to overwrite with whitespaces otherwise pre-edit characters will
//      * be left in the line otherwise this callback would need to perform
//      * two edit to achieve removing the whitespaces in delta bigger than
//      * 1. resizing range will only affact to target range but not out or
//      * range.
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeMultipleWhitespace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const textLine = this.getTextLineFromRange(range);
//         let startPosition = textLine.firstNonWhitespaceCharacterIndex;

//         if (LineUtil.isMultipleWhiteSpace(textLine.text) && !textLine.isEmptyOrWhitespace) {

//             if (LineUtil.isBlockCommentWithCharacter(textLine.text)) {
//                 startPosition = textLine.text.indexOf('*');
//             }

//             if (LineUtil.isLineInlineComment(textLine.text)) {
//                 return;
//             }

//             const newLineText = textLine.text.trim();
//             let stringLiteral = false;
//             const length = newLineText.length;
//             let i = 0;
//             let result = '';
//             let lineComment: RegExpExecArray | null = LineUtil.lineCommentWithWhitespace(newLineText);

//             while (i++ < length) {
//                 const char: string = newLineText[i - 1];
//                 const isQuote = (char === '"' || char === "'");
//                 if (isQuote) {
//                     stringLiteral = !stringLiteral;
//                 }

//                 if (isQuote || stringLiteral) {
//                     result += char;
//                     continue;
//                 }

//                 const previous = newLineText[i];
//                 if (char === ' ' && previous === ' ') {
//                     if (lineComment) {
//                         if (lineComment.length > 0 && !config.of.removeWhitespaceBeforeInlineComment) {
//                             const commentLength = lineComment[0].length;
//                             i += commentLength - 1;
//                             result += lineComment[0];
//                             lineComment = <RegExpExecArray>lineComment.filter((value, index) => index !== 0);
//                         }
//                     }
//                     continue;
//                 } else {
//                     result += char;
//                 }
//             }

//             // console.log(startPosition);
//             // console.log('startPosition', result.padStart( startPosition + result.length, ' '));
//             // console.log('startPosition', textLine.text);

//             if (textLine.text !== result.padStart(startPosition + result.length, ' ')) {
//                 return {
//                     name: 'removeMultipleWhitespace',
//                     range: this.newRangeZeroBased(
//                         range.start.line,
//                         startPosition,
//                         textLine.text.length
//                     ),
//                     string: result
//                 };
//             }
//         }
//         return;
//     };

//     /**
//      * check if the current cursor or selected range is empty line and
//      * next. if both current and next is emtpy, remove current line.
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeMulitpleEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const previousLine = this.getTextLineFromRange(range, -1);
//         const currentLine = this.getTextLineFromRange(range);
//         if (range.end.line <= this.editor.document.lineCount && range.start.line > 0) {
//             const nextLine = this.getTextLineFromRange(range, 1);
//             if (currentLine.isEmptyOrWhitespace && nextLine.isEmptyOrWhitespace) {
//                 return {
//                     name: 'removeMulitpleEmptyLine',
//                     range: new vscode.Range(
//                         new vscode.Position(range.start.line - 1, previousLine.text.length),
//                         new vscode.Position(range.start.line, 0)
//                     )
//                 };
//             }
//         }
//         return;
//     };

//     /**
//      * remove line if the line is commented
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeCommentedLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const lineText = this.getText(range);
//         const commentIndex = LineUtil.getlineCommentIndex(lineText);

//         // if (deleteCommentAlsoDeleteBlockComment) {
//         // if (LineUtil.isBlockCommentStartingLine(lineText)) {

//         // }

//         // if (LineUtil.isBlockCommentWithCharacter(lineText)) {

//         // }

//         // if (LineUtil.isBlockCommentEndingLine(lineText)) {

//         // }
//         // }

//         if (LineUtil.isLineCommented(lineText)) {
//             return {
//                 name: 'removeCommentedLine',
//                 range: this.lineFullRangeWithEOL(range)
//             };
//         } else if (commentIndex !== -1) {
//             return {
//                 name: 'removeCommentedLine',
//                 range: this.newRangeZeroBased(range.start.line, commentIndex - 1, lineText.length)
//             };
//         }
//         return;
//     };

//     /**
//      * remove line if the line is empty without characters.
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
//         if (currentLine) {
//             return {
//                 name: 'removeEmptyLine',
//                 range: this.lineFullRangeWithEOL(range)
//             };
//         }
//         return;
//     };

//     /**
//      * check if the current cursor or selected range is empty line and
//      * next. if both current and next is emtpy, remove current line.
//      *
//      * @param range target range
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public removeDuplicateLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const currentLine = this.getTextLineFromRange(range);
//         const nextLine = this.getTextLineFromRange(range, 1);
//         if (currentLine.text === nextLine.text) {
//             return {
//                 name: 'removeDuplicateLine',
//                 range: this.lineFullRangeWithEOL(range)
//             };
//         }
//         return;
//     };

//     /**
//      * remove empty block comment line if the previous line is block comment
//      * start
//      *
//      * @param range
//      * @returns
//      *
//      */
//     public removeEmptyBlockCommentLineOnStart = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const currentLine: vscode.TextLine = this.getTextLineFromRange(range);
//         const beforeLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
//         const blockCommentStart: boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

//         if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
//             const lineIteration = this.iterateNextLine(range, LineUtil.isEmptyBlockComment);
//             if (lineIteration) {
//                 return {
//                     name: 'removeEmptyBlockCommentLineOnStart',
//                     range: new vscode.Range(
//                         new vscode.Position(range.start.line, 0),
//                         new vscode.Position(lineIteration.lineNumber, 0)
//                     ),
//                     block: {
//                         priority: LineType.LineEditBlockPriority.MID,
//                         lineSkip: lineIteration.lineSkip
//                     }
//                 };
//             }
//         }
//         return;
//     };

//     /**
//      * remove current empty block comment line if next line is also empty
//      * block comment line.
//      *
//      * @param range
//      * @returns
//      *
//      */
//     public removeMultipleEmptyBlockCommentLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const previousLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
//         const currentLine: vscode.TextLine = this.getTextLineFromRange(range);
//         const nextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
//         const nextLineIsBlockCommend: boolean = LineUtil.isEmptyBlockComment(nextLine.text);
//         const LineIsBlockCommend: boolean = LineUtil.isEmptyBlockComment(currentLine.text);
//         const beforeLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
//         const blockCommentStart: boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

//         // previous line is unclosed block comment but random whitespace line appear in block comment.
//         if (LineUtil.isBlockCommentWithCharacter(previousLine.text) && previousLine.isEmptyOrWhitespace) {
//             const lineIteration = this.iterateNextLine(range, "isEmptyOrWhitespace");
//             if (lineIteration) {
//                 return {
//                     name: 'removeMultipleEmptyBlockCommentLine',
//                     range: new vscode.Range(
//                         new vscode.Position(range.start.line, 0),
//                         new vscode.Position(lineIteration.lineNumber, 0)
//                     ),
//                     block: {
//                         priority: LineType.LineEditBlockPriority.MID,
//                         lineSkip: lineIteration.lineSkip
//                     }
//                 };
//             }
//         }

//         if (LineIsBlockCommend && nextLineIsBlockCommend && !blockCommentStart) {
//             return {
//                 name: 'removeMultipleEmptyBlockCommentLine',
//                 range: this.lineFullRangeWithEOL(range)
//             };
//         }
//         return;
//     };

//     /**
//      * insert empty block comment line if next line is block comment end
//      *
//      * @param range
//      * @returns
//      *
//      */
//     public insertEmptyBlockCommentLineOnEnd = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const EOL = this.getEndofLine();
//         const currentLine: vscode.TextLine = this.getTextLineFromRange(range);
//         const nextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
//         const NextLineblockCommentEnd: boolean = LineUtil.isBlockCommentEndingLine(nextLine.text);

//         if (NextLineblockCommentEnd && LineUtil.isBlockCommentWithCharacter(currentLine.text)) {
//             return {
//                 name: 'insertEmptyBlockCommentLineOnEnd',
//                 range: this.newRangeZeroBased(range.start.line, currentLine.text.length, currentLine.text.length),
//                 string: EOL + LineUtil.cleanBlockComment(currentLine.text) + " "
//             };
//         }
//         return;
//     };

//     /**
//      * funciton removes empty-lines next block-comment lines.
//      *
//      * @param range range of the line.
//      * @returns LineEditInfo or undefined
//      *
//      */
//     public removeEmptyLinesBetweenBlockCommantAndCode = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         // return;
//         const currentTextLine = this.getTextLineFromRange(range);
//         const previousTextLine = this.getTextLineFromRange(range, -1);
//         if (currentTextLine.isEmptyOrWhitespace && LineUtil.isBlockCommentEndingLine(previousTextLine.text)) {
//             const lineIteration = this.iterateNextLine(range, "isEmptyOrWhitespace");
//             if (lineIteration) {
//                 return {
//                     name: 'removeEmptyLinesBetweenBlockCommantAndCode',
//                     range: new vscode.Range(
//                         new vscode.Position(range.start.line, 0),
//                         new vscode.Position(lineIteration.lineNumber, 0)
//                     ),
//                     type: LineType.LineEditType.DELETE,
//                     block: {
//                         lineSkip: lineIteration.lineSkip,
//                         priority: LineType.LineEditBlockPriority.HIGH
//                     }
//                 };
//             }
//         }
//         return;
//     };

//     /**
//      * this function needs to do 2 edit, 1 is to add new string at position
//      * 0,0 and delete rest of the un-justified strings.
//      *
//      * @param range
//      * @returns
//      *
//      */
//     public blockCommentWordCountJustifyAlign = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         const currentTextLine: vscode.TextLine = this.getTextLineFromRange(range);
//         const lineTextInArray: string[] = [];
//         if (LineUtil.isBlockComment2(currentTextLine.text) && !LineUtil.isJSdocTag(currentTextLine.text)) {
//             const indentIndex = currentTextLine.text.indexOf("*");
//             const indentString = currentTextLine.text.substring(0, indentIndex + 1);
//             if (currentTextLine.text.length < (config.of.blockCommentCharacterBoundaryBaseLength) || currentTextLine.text.length > (config.of.blockCommentCharacterBoundaryBaseLength + config.of.blockCommentCharacterBoundaryToleranceLength)) {
//                 const trueConditionCallback = (line: vscode.TextLine) => {
//                     lineTextInArray.push(...line.text.replaceAll("*", "").trim().split(/\s+/));
//                 };

//                 const lineIteration = this.iterateNextLine(range,
//                     LineUtil.isBlockComment2,
//                     LineUtil.isJSdocTag,
//                     trueConditionCallback);

//                 let newString: string = "";
//                 let newLine = indentString + " ";
//                 for (const [index, str] of lineTextInArray.entries()) {
//                     if (str.length > 0) {
//                         newLine += str + " ";
//                         if (newLine.length > config.of.blockCommentCharacterBoundaryBaseLength) {
//                             newString += newLine + this.getEndofLine();
//                             newLine = indentString + " ";
//                         }
//                     }
//                     if (index === lineTextInArray.length - 1) {
//                         newString += newLine + this.getEndofLine();
//                     }
//                 }

//                 if (lineIteration) {
//                     return {
//                         name: 'blockCommentWordCountJustifyAlign',
//                         range: new vscode.Range(
//                             new vscode.Position(range.start.line, 0),
//                             new vscode.Position(lineIteration.lineNumber, 0)
//                         ),
//                         type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
//                         string: newString,
//                         block: {
//                             lineSkip: lineIteration.lineSkip,
//                             priority: LineType.LineEditBlockPriority.HIGH
//                         }
//                     };
//                 }
//             }
//         }
//         return;
//     };

// //     public blockCommentWordCountJustifyAlign = (range: vscode.Range): LineType.LineEditInfo | undefined => {
// //         // return;
// //         // const prevTextLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
// //         const currTextLine: vscode.TextLine = this.getTextLineFromRange(range);
// //         const nextTextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
// //         const lineTextInArray: string[] = [];
// //         if (LineUtil.isBlockCommentWithCharacter(currTextLine.text) && !LineUtil.isJSdocTag(currTextLine.text) && !LineUtil.isBlockCommentEndingLine(currTextLine.text)) {
// //             const indentIndex = currTextLine.text.indexOf("*");
// //             const indentString = currTextLine.text.substring(0, indentIndex + 1);

// //             if (LineUtil.checkBlockCommentNeedAlign(currTextLine.text)) {
// //                 // console.log('isBlockCommentNeedAlign');
// //                 return;
// //             }

// //             const textLineLessThanBase = currTextLine.text.length < config.of.blockCommentCharacterBoundaryBaseLength;
// //             const textLineBiggerThanBaseWithTol = currTextLine.text.length > (config.of.blockCommentCharacterBoundaryBaseLength + config.of.blockCommentCharacterBoundaryToleranceLength);
// // // if (LineUtil.isEmptyBlockComment(nextTextLine.text)) {
// //                 // return;
// //                 // }
// //             if (textLineLessThanBase || textLineBiggerThanBaseWithTol) {
// //                 console.log('oor', range.start.line, currTextLine.text.length, config.of.blockCommentCharacterBoundaryBaseLength)
// //                 // console.log('oor2', currentTextLine.text.length, config.of.blockCommentCharacterBoundaryBaseLength)
// //                 const trueConditionCallback = (line: vscode.TextLine) => {
// //                     lineTextInArray.push(...line.text.replaceAll("*", "").trim().split(/\s+/));
// //                 };

// //                 const lineIteration = this.iterateNextLine(range,
// //                     LineUtil.isBlockCommentWithCharacter,
// //                     LineUtil.isJSdocTag,
// //                     LineUtil.isEmptyBlockComment,
// //                     trueConditionCallback);

// //                 let newString: string = "";
// //                 let newLine = indentString + " ";
// //                 for (const [index, str] of lineTextInArray.entries()) {
// //                     if (str.length > 0) {
// //                         newLine += str + " ";
// //                         if (newLine.length > config.of.blockCommentCharacterBoundaryBaseLength) {
// //                             newString += newLine + this.getEndofLine();
// //                             newLine = indentString + " ";
// //                         }
// //                     }
// //                     if (index === lineTextInArray.length - 1) {
// //                         newString += newLine + this.getEndofLine();
// //                     }
// //                 }
// //                 console.log(lineIteration)
// //                 if (lineIteration) {
// //                     return {
// //                         name: 'blockCommentWordCountJustifyAlign',
// //                         range: new vscode.Range(
// //                             new vscode.Position(range.start.line, 0),
// //                             new vscode.Position(lineIteration.lineNumber, 0)
// //                         ),
// //                         type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
// //                         string: newString,
// //                         block: {
// //                             lineSkip: lineIteration.lineSkip,
// //                             priority: LineType.LineEditBlockPriority.HIGH
// //                         }
// //                     };
// //                 }
// //             }
// //         }
// //         return;
// //     };

//     /**
//      * @param range
//      * @returns
//      */
//     public genericFixBlockCommentLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         // this function should do couple of the things,
//         // - fix star signs position
//         // - delete empty lines if block-comment is not closed
//         // return;

//         const previousLine = this.getTextLineFromRange(range, - 1);
//         const currentLine = this.getTextLineFromRange(range);

//         if (LineUtil.isBlockCommentWithCharacter(previousLine.text) || LineUtil.isBlockCommentStartingLine(previousLine.text)) {
//             if (currentLine.isEmptyOrWhitespace) {
//                 const lineIteration = this.iterateNextLine(
//                     range,
//                     'isEmptyOrWhitespace');

//                 if (lineIteration) {
//                     return {
//                         name: 'genericFixBlockCommentLine',
//                         range: new vscode.Range(
//                             new vscode.Position(range.start.line, 0),
//                             new vscode.Position(lineIteration.lineNumber + 1, 0)
//                         ),
//                         type: LineType.LineEditType.DELETE,
//                         block: {
//                             lineSkip: lineIteration.lineSkip,
//                             priority: LineType.LineEditBlockPriority.HIGH
//                         }
//                     };
//                 }
//             }

//             let prevLineText = previousLine.text;
//             let currLineText = currentLine.text;

//             if (LineUtil.isBlockComment(currentLine.text) || LineUtil.isBlockCommentWithCharacter(currentLine.text)) {
//                 if (currLineText.indexOf('*') === prevLineText.indexOf('*')) {
//                     return;
//                 } else {
//                     // need to fix indent size and fix other issues.
//                     currLineText = currLineText.trimStart().padStart(prevLineText.indexOf('*'), ' ');

//                     // trailing space will be handled by other fn.
//                     // multiple whitespace will be handled by other fn.

//                 }
//             }

//         }
//         return;
//     };

//     /**
//      * funciton to print current datetime where the cursor is. - locale
//      * - iso - custom
//      *
//      * @param range target range, whichi will be the very starting of line.
//      * @returns object descripting where/how to edit the line or undefined if no condition is met.
//      *
//      */
//     public setNowDateTimeOnLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
//         return {
//             name: 'setNowDateTimeOnLine',
//             range: range,
//             string: LineUtil.getNowDateTimeStamp.custom()
//         };
//     };
// }