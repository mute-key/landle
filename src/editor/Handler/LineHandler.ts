import * as vscode from "vscode";
import {
    Line,
    LineType
} from "./Line";
import { LineUtil } from "../../common/LineUtil";
import { config } from "../../common/config";

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

    #checkIfRangeTextIsEqual = (range: vscode.Range, newText: string): boolean => {
        return this.editor.document.getText(range) === newText;
    };

    /**
     * check if the document is starting with empty line and removes them.
     * 
     * @param range
     * @returns
     * 
     */
    public removeDocumentStartingEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        let lineNumber: number = range.start.line;
        if (lineNumber === 0) {
            const lineIteration = this.iterateNextLine(range, (line: vscode.TextLine) => line.isEmptyOrWhitespace);
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
    public removeTrailingWhiteSpace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textline = this.getTextLineFromRange(range);
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
                range: this.newRangeZeroBased(range.start.line, whitespacePos, endPos)
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
    public removeMultipleWhitespace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textLine = this.getTextLineFromRange(range);
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
                    range: this.newRangeZeroBased(
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
    public removeMulitpleEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const previousLine = this.getTextLineFromRange(range, -1);
        const currentLine = this.getTextLineFromRange(range);
        if (range.end.line <= this.editor.document.lineCount && range.start.line > 0) {
            const nextLine = this.getTextLineFromRange(range, 1);

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
    public removeCommentedLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const lineText = this.getText(range);
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
                range: this.lineFullRangeWithEOL(range)
            };
        } else if (commentIndex !== -1) {
            return {
                name: 'removeCommentedLine',
                range: this.newRangeZeroBased(range.start.line, commentIndex - 1, lineText.length)
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
    public removeEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                name: 'removeEmptyLine',
                range: this.lineFullRangeWithEOL(range)
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
    public removeDuplicateLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = this.getTextLineFromRange(range);
        const nextLine = this.getTextLineFromRange(range, 1);
        if (currentLine.text === nextLine.text) {
            return {
                name: 'removeDuplicateLine',
                range: this.lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * remove empty block comment line if the previous line is block comment
     * start
     * 
     * @param range
     * @returns
     * 
     */
    public removeEmptyBlockCommentLineOnStart = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine: vscode.TextLine = this.getTextLineFromRange(range);
        const beforeLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
        const blockCommentStart: boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

        if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
            const lineIteration = this.iterateNextLine(range, (line: vscode.TextLine) => LineUtil.isEmptyBlockComment(line.text));
            if (lineIteration) {
                return {
                    name: 'removeEmptyBlockCommentLineOnStart',
                    range: new vscode.Range(
                        new vscode.Position(range.start.line, 0),
                        new vscode.Position(lineIteration.lineNumber, 0)
                    ),
                    block: {
                        priority: LineType.LineEditBlockPriority.MID,
                        lineSkip: lineIteration.lineSkip
                    }
                };
            }
        }
        return;
    };

    /**
     * remove current empty block comment line if next line is also empty
     * block comment line.
     * 
     * @param range
     * @returns
     * 
     */
    public removeMultipleEmptyBlockCommentLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const prevTextLine: vscode.TextLine = this.getTextLineFromRange(range, -1);
        const currTextLine: vscode.TextLine = this.getTextLineFromRange(range);
        const nextTextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
        const nextLineIsBlockCommend: boolean = LineUtil.isEmptyBlockComment(nextTextLine.text);
        const currLineIsBlockCommend: boolean = LineUtil.isEmptyBlockComment(currTextLine.text);
        const prevLineblockCommentStart: boolean = LineUtil.isBlockCommentStartingLine(prevTextLine.text);

        const isNextLineBlockCommentClose = LineUtil.isBlockCommentEndingLine(nextTextLine.text);
        const isCurrLineJsDoc = LineUtil.isJSdocTag(nextTextLine.text);

        if (currLineIsBlockCommend && nextLineIsBlockCommend && !prevLineblockCommentStart) {
            // && !isNextLineBlockCommentClose
            console.log('removeMultipleEmptyBlockCommentLine1', currTextLine.lineNumber);
            return {
                name: 'removeMultipleEmptyBlockCommentLine',
                range: this.lineFullRangeWithEOL(range)
            };
        }

        // LineUtil.isJSdocTag(previousLine.text)

        // previous line is unclosed block comment but random whitespace line appear in block comment.
        // if (LineUtil.isBlockCommentWithCharacter(previousLine.text) && previousLine.isEmptyOrWhitespace) {
        // console.log('removeMultipleEmptyBlockCommentLine1', currentLine.lineNumber, currentLine.text)

        // if (!isCurrLineJsDoc) {

        // } else if(isCurrLineJsDoc) {

        // }

        // const lineIteration = this.iterateNextLine(range, "isEmptyOrWhitespace");
        // if (lineIteration) {
        // return {
        // name: 'removeMultipleEmptyBlockCommentLine',
        // range: new vscode.Range(
        // new vscode.Position(range.start.line, 0),
        // new vscode.Position(lineIteration.lineNumber, 0)
        // ),
        // block: {
        // priority: LineType.LineEditBlockPriority.MID,
        // lineSkip: lineIteration.lineSkip
        // }
        // };
        // }
        // }

        return;
    };

    /**
     * insert empty block comment line if next line is block comment end
     * 
     * @param range
     * @returns
     * 
     */
    public insertEmptyBlockCommentLineOnEnd = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const EOL = this.getEndofLine();
        const currentLine: vscode.TextLine = this.getTextLineFromRange(range);
        const nextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
        const NextLineblockCommentEnd: boolean = LineUtil.isBlockCommentEndingLine(nextLine.text);

        if (NextLineblockCommentEnd && LineUtil.isBlockCommentWithCharacter(currentLine.text)) {
            return {
                name: 'insertEmptyBlockCommentLineOnEnd',
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
    public removeEmptyLinesBetweenBlockCommantAndCode = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        // return;
        const currentTextLine = this.getTextLineFromRange(range);
        const previousTextLine = this.getTextLineFromRange(range, -1);
        if (currentTextLine.isEmptyOrWhitespace && LineUtil.isBlockCommentEndingLine(previousTextLine.text)) {
            const lineIteration = this.iterateNextLine(range, (line: vscode.TextLine) => line.isEmptyOrWhitespace);
            if (lineIteration) {
                return {
                    name: 'removeEmptyLinesBetweenBlockCommantAndCode',
                    range: new vscode.Range(
                        new vscode.Position(range.start.line, 0),
                        new vscode.Position(lineIteration.lineNumber, 0)
                    ),
                    type: LineType.LineEditType.DELETE,
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
     * this function needs to do 2 edit, 1 is to add new string at position
     * 0,0 and delete rest of the un-justified strings.
     * 
     * @param range
     * @returns
     * 
     */
    public blockCommentWordCountJustifyAlign = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currTextLine: vscode.TextLine = this.getTextLineFromRange(range);
        const isCurrBlockCommentStartingLine = LineUtil.isBlockCommentStartingLine(currTextLine.text);
        let includeOpenningLine = false;
        let lineRange: vscode.Range = range;

        if (isCurrBlockCommentStartingLine) {

            let LineString = '';
            if (LineUtil.isBlockCommentStartingLineWithCharacter(currTextLine.text)) {
                includeOpenningLine = true;
            }

            // const nextLineFix = this.fixBrokenBlockCommnet(range);
            // if (nextLineFix) {
            //     // LineString = nextLineFix.string;
            //     LineString = '';
            //     if (LineUtil.isEmptyBlockComment(LineString)) {
            //         return;
            //     }
            // }
        }

        if ((LineUtil.isBlockCommentWithCharacter(currTextLine.text) || includeOpenningLine)
            && !LineUtil.isJSdocTag(currTextLine.text)
            && !LineUtil.isBlockCommentEndingLine(currTextLine.text)) {

            const lineTextInArray: string[] = [];
            let indentIndex = currTextLine.text.indexOf("*");
            let indentString = currTextLine.text.substring(0, indentIndex + 1) + ' ';
            let startPosition = 0;
            let newLine = indentString;
            let newString: string = "";
            let newStringArr: string[] = [];

            if (includeOpenningLine) {
                lineTextInArray.push(...currTextLine.text.replaceAll("/**", "").trim().split(/\s+/).filter(s => s.length > 0));
                const nextTextLine: vscode.TextLine = this.getTextLineFromRange(range, 1);
                indentIndex = nextTextLine.text.indexOf("*");
                indentString = nextTextLine.text.substring(0, indentIndex + 1) + ' ';
                newLine = '';
                startPosition = currTextLine.text.indexOf('/**') + 3;
                newString += this.getEndofLine() + indentString;
                newStringArr.push(this.getEndofLine(), indentString);
                console.log('includeOpenningLine', indentIndex, range.start.line);
                lineRange = new vscode.Range(
                    new vscode.Position(range.start.line + 1, 0),
                    new vscode.Position(range.end.line + 1, 0)
                );
            }

            const lineCondition = (line: vscode.TextLine): boolean => {
                let lineText: string = line.text;

                if (LineUtil.isEmptyBlockComment(lineText)) {
                    return false;
                }

                const cond1 = LineUtil.isBlockCommentWithCharacter(lineText);
                const cond2 = LineUtil.isBlockCommentStartingLineWithCharacter(lineText);
                if (cond1 || cond2) {
                    const fixedLine = this.fixBrokenBlockCommnet(range);
                    if (fixedLine && fixedLine.string) {
                        lineText = fixedLine.string;
                        return true;
                    }
                    return true;
                }

                if (LineUtil.checkBlockCommentNeedSkip(lineText)) {
                    return false;
                }

                const textLineLessThanBase = lineText.length < config.of.blockCommentCharacterBoundaryBaseLength;
                const textLineBiggerThanBaseAndTolerance = lineText.length > (config.of.blockCommentCharacterBoundaryBaseLength + config.of.blockCommentCharacterBoundaryToleranceLength);
                if (textLineBiggerThanBaseAndTolerance || textLineLessThanBase) {
                    return true;
                }

                return false;
            };

            const continueCheck = (line: vscode.TextLine): boolean => {
                return LineUtil.isJSdocTag(line.text);
            };

            const trueConditionTask = (line: vscode.TextLine) => {
                lineTextInArray.push(...line.text.replaceAll("*", "").trim().split(/\s+/).filter(s => s.length > 0));
            };

            const lineIteration = this.iterateNextLine(lineRange, lineCondition, continueCheck, trueConditionTask);

            for (const str of lineTextInArray) {
                if ((newLine.length - 1) > config.of.blockCommentCharacterBoundaryBaseLength) {
                    newString += newLine.trimEnd() + this.getEndofLine();
                    newLine = indentString;
                } 
                newLine += str + ' ';
            }

            newString += newLine.trimEnd() + this.getEndofLine();

            if (lineIteration) {
                const newRange = new vscode.Range(
                    new vscode.Position(range.start.line, startPosition),
                    new vscode.Position(lineIteration.lineNumber, 0)
                );

                if (this.#checkIfRangeTextIsEqual(newRange, newString)) {
                    return;
                }

                return {
                    name: 'blockCommentWordCountJustifyAlign',
                    range: newRange,
                    type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
                    string: newString,
                    block: {
                        lineSkip: lineIteration.lineSkip,
                        priority: LineType.LineEditBlockPriority.HIGH
                    }
                };
            }
            return;
        };
    };

    /**
     * @param range
     * @returns
     * 
     */
    public fixBrokenBlockCommnet = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        // 블록 주석 인덴트, <- 이것도 문제일수 있는데????
        // 블록 주석 내에서 불필요한 빈 줄이 있는 경우 <- 이건 쉬움
        // 블록 내에 주석문자 없지만 문자가 채워져잇음
        // 시작점은 첫줄. 
        // 만약 config.of.blockCommentWordCountJustifyAlign 이게 참이면 라인별 리턴 
        // 이게 참이 아니면 전체 블록주석 고치고 리턴 
        // 단지 문제라면 이게 지금까지 사용해온 호출구조가 달라지는데 흠 
        // 일단 구현해놓고 최적화 하자 

        /**
         * 스타팅 라인에 형태가 망가질수가 있나??? 
         * 
         * 
         * 전줄이 주석인지 확인 
         *  - 전줄이 주석이면 현재 줄은 문제가 없는지 확인  
         * 
         * 
         */
        const prevTextLine = this.getTextLineFromRange(range, -1);
        const currTextLine = this.getTextLineFromRange(range);
        const nextTextLine = this.getTextLineFromRange(range, 1);

        const isPrevBlockCommentStartingLine = LineUtil.isBlockCommentStartingLine(prevTextLine.text);
        const isCurrBlockCommentStartingLine = LineUtil.isBlockCommentStartingLine(currTextLine.text);
        const isNextLineBlockComment = LineUtil.isBlockComment(currTextLine.text);
        const isNextLineEmptyLine = LineUtil.isBlockCommentStartingLine(currTextLine.text);
        const isNextLineNotBlockCommenNonWhitespace = LineUtil.isBlockCommentStartingLine(currTextLine.text);

        LineUtil.isBlockCommentStartingLineWithCharacter(prevTextLine.text);


        // const checkNextLineFIx = 

        // if () {
        //     prevTextLine
        // }




        if (config.of.blockCommentWordCountJustifyAlign) {

        } else {

            // while (true) {

            // }
            // return whole block after the fix 
        }







        // 주석 내에 불필요한 공백이나 문자가 있는 경우:
        // 블록 주석의 시작과 끝이 제대로 닫히지 않은 경우: <- 이건 유저가 알아서 닫길 바래야겟다.

        // console.log('fixBrokenBlockCommnet', range.start.line)
        // if current line is block comment

        // this function should do couple of the things,
        // - fix star signs position
        // - delete empty lines if block-comment is not closed
        //
        // const prevLine = this.getTextLineFromRange(range, - 1);
        // const currLine = this.getTextLineFromRange(range);
        // const nextLine = this.getTextLineFromRange(range);
        //
        // if (LineUtil.isBlockCommentWithCharacter(prevLine.text) && LineUtil.isEmptyBlockComment(currLine.text)) {
        //
        // }
        //
        // if (LineUtil.isBlockCommentWithCharacter(previousLine.text) || LineUtil.isBlockCommentStartingLine(previousLine.text)) {
        //
        // if (currentLine.isEmptyOrWhitespace) {
        // const lineIteration = this.iterateNextLine(
        // range,
        // 'isEmptyOrWhitespace');
        //
        // if (lineIteration) {
        // return {
        // name: 'genericFixBlockCommentLine',
        // range: new vscode.Range(
        // new vscode.Position(range.start.line, 0),
        // new vscode.Position(lineIteration.lineNumber + 1, 0)
        // ),
        // type: LineType.LineEditType.DELETE,
        // block: {
        // lineSkip: lineIteration.lineSkip,
        // priority: LineType.LineEditBlockPriority.HIGH
        // }
        // };
        // }
        // }
        //
        // let prevLineText = previousLine.text;
        // let currLineText = currentLine.text;
        //
        // if (LineUtil.isBlockComment(currentLine.text) || LineUtil.isBlockCommentWithCharacter(currentLine.text)) {
        // if (currLineText.indexOf('*') === prevLineText.indexOf('*')) {
        // return;
        // } else {
        // // need to fix indent size and fix other issues.
        // currLineText = currLineText.trimStart().padStart(prevLineText.indexOf('*'), ' ');

        // // trailing space will be handled by other fn.
        // // multiple whitespace will be handled by other fn.

        // }
        // }

        // }
        return {
            range: range,
            string: ''
        };
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
    public setNowDateTimeOnLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        return {
            name: 'setNowDateTimeOnLine',
            range: range,
            string: LineUtil.getNowDateTimeStamp.custom()
        };
    };
}