import * as vscode from "vscode";
import {
    Line
} from "../Collection/Line";
import { LineType } from "../../type/LineType";

import { LineUtil } from "../../common/Util";
import { config } from "../../common/config";
import { BaseHandler } from "./BaseHandler";

/**
 * 1. 공백처리도 해야한다
 * 2. 공백이 아닌 문자열도 처리해야한다.
 * 3. 주석 위치도 고쳐야한다.
 * 4. 주석 첫 시작 문자열도 고쳐야한다.
 * 
 * 문제라면 현재 문서를 기반으로 수정하는거라 범위도 같이 수정해야한다는거?
 * 브레이크 상태는 뭐 대충 정리가 된거같은데
 * 브레이크 다음상태가 문제다
 * 그럼 정렬을 하다가 루프가 멈췃다
 * 그렇다면 다음줄은 이거 수정이 필요한지 아닌지 봐야하는건데,
 * 그럼 정렬이 먼저인가 수정이 먼저인가 아니면 둘다인가?
 * 수리는 무조건이다
 * 정렬은 선택적이다
 * 그럼 수리가 먼저이네?
 * 수리 먼저 하고 정렬하면되겟다.
 * 
 * 근데 저건 설정따라 가는건데,
 * 
 */
export abstract class CommentHandler extends BaseHandler {

    constructor() {
        super();
    }

    #ifBlockCommentBroken = (range: vscode.Range) => {

    };

    /**
     * this function needs to do 2 edit, 1 is to add new string at position
     * 0,0 and delete rest of the un-justified strings.
     * 
     * @param range
     * @returns
     * 
     */
    public static blockCommentWordCountJustifyAlign = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currTextLine: vscode.TextLine = Line.getTextLineFromRange(range);
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
            // LineString = '';
            // if (LineUtil.isEmptyBlockComment(LineString)) {
            // return;
            // }
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
                const nextTextLine: vscode.TextLine = Line.getTextLineFromRange(range, 1);
                indentIndex = nextTextLine.text.indexOf("*");
                indentString = nextTextLine.text.substring(0, indentIndex + 1) + ' ';
                newLine = '';
                startPosition = currTextLine.text.indexOf('/**') + 3;
                newString += Line.getEndofLine() + indentString;
                newStringArr.push(Line.getEndofLine(), indentString);
                console.log('includeOpenningLine', indentIndex, range.start.line);
                lineRange = new vscode.Range(
                    new vscode.Position(range.start.line + 1, 0),
                    new vscode.Position(range.end.line + 1, 0)
                );
            }

            const lineCondition = (line: string): boolean => {
                let lineText: string = line;

                if (LineUtil.isEmptyBlockComment(line)) {
                    return false;
                }

                if (LineUtil.isBlockCommentEndingLine(line)) {
                    return false;
                }

                const cond1 = LineUtil.isBlockCommentWithCharacter(line);
                const cond2 = LineUtil.isBlockCommentStartingLineWithCharacter(line);
                if (cond1 || cond2) {
                    // const fixedLine = this.fixBrokenBlockCommnet(range);
                    // if (fixedLine && fixedLine.string) {
                    // return true;
                    // }
                    return true;
                }

                if (LineUtil.checkBlockCommentNeedSkip(line)) {
                    return true;
                }

                if (LineUtil.isJSdocTag(line)) {
                    return true;
                }

                const textLineLessThanBase = lineText.length < config.of.blockCommentCharacterBoundaryBaseLength;
                const textLineBiggerThanBaseAndTolerance = lineText.length > (config.of.blockCommentCharacterBoundaryBaseLength + config.of.blockCommentCharacterBoundaryToleranceLength);
                if (textLineBiggerThanBaseAndTolerance || textLineLessThanBase) {
                    return true;
                }

                return false;
            };

            const continueCheck = (line: string): boolean => {
                return LineUtil.isEmptyBlockComment(line);
            };

            const trueConditionTask = (line: string) => {
                lineTextInArray.push(...line.replaceAll("*", "").trim().split(/\s+/).filter(s => s.length > 0));
            };

            const lineModTask = (line: string): string => {

                // 라인유틸에서 구현해야하나
                // 그냥 따로 파서 클래스를 만들자.
                // 난 컨트롤러 따위는 만들고 싶지 않다
                // 사실 컨트롤러는 하나인게 맞다고 생각한다.
                // 문제는, 이게 최상위라면 다른 수정작업들을 다 무시하고 이 정렬작업이 모든 문제를 해결해야한다는거다.

                // this.lineFullRange()
                // this.fixBrokenBlockCommnet(range);

                return '';
            };

            const lineIteration = Line.iterateNextLine(lineRange, lineCondition, continueCheck, trueConditionTask);
            // const lineIteration = Line.iterateNextLine(lineRange, lineCondition, continueCheck, trueConditionTask, lineModTask);

            for (const str of lineTextInArray) {
                if ((newLine.length - 1) > config.of.blockCommentCharacterBoundaryBaseLength) {
                    newString += newLine.trimEnd() + Line.getEndofLine();
                    newLine = indentString;
                }
                newLine += str + ' ';
            }

            newString += newLine.trimEnd() + Line.getEndofLine();

            if (lineIteration) {
                const newRange = new vscode.Range(
                    new vscode.Position(range.start.line, startPosition),
                    new vscode.Position(lineIteration.lineNumber, 0)
                );

                if (Line.checkIfRangeTextIsEqual(newRange, newString)) {
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
     * remove empty block comment line if the previous line is block comment
     * start
     * 
     * @param range
     * @returns
     * 
     */
    public static removeEmptyBlockCommentLineOnStart = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine: vscode.TextLine = Line.getTextLineFromRange(range);
        const beforeLine: vscode.TextLine = Line.getTextLineFromRange(range, -1);
        const blockCommentStart: boolean = LineUtil.isBlockCommentStartingLine(beforeLine.text);

        if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
            const lineIteration = Line.iterateNextLine(range, (line: string) => LineUtil.isEmptyBlockComment(line));
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
    public static removeMultipleEmptyBlockCommentLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const prevTextLine: vscode.TextLine = Line.getTextLineFromRange(range, -1);
        const currTextLine: vscode.TextLine = Line.getTextLineFromRange(range);
        const nextTextLine: vscode.TextLine = Line.getTextLineFromRange(range, 1);
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
                range: Line.lineFullRangeWithEOL(range)
            };
        }

        // LineUtil.isJSdocTag(previousLine.text)

        // previous line is unclosed block comment but random whitespace line appear in block comment.
        // if (LineUtil.isBlockCommentWithCharacter(previousLine.text) && previousLine.isEmptyOrWhitespace) {
        // console.log('removeMultipleEmptyBlockCommentLine1', currentLine.lineNumber, currentLine.text)

        // if (!isCurrLineJsDoc) {

        // } else if(isCurrLineJsDoc) {

        // }

        // const lineIteration = Line.iterateNextLine(range, "isEmptyOrWhitespace");
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
    public static insertEmptyBlockCommentLineOnEnd = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const EOL = Line.getEndofLine();
        const currentLine: vscode.TextLine = Line.getTextLineFromRange(range);
        const nextLine: vscode.TextLine = Line.getTextLineFromRange(range, 1);
        const NextLineblockCommentEnd: boolean = LineUtil.isBlockCommentEndingLine(nextLine.text);

        if (NextLineblockCommentEnd && LineUtil.isBlockCommentWithCharacter(currentLine.text)) {
            return {
                name: 'insertEmptyBlockCommentLineOnEnd',
                range: Line.newRangeZeroBased(range.start.line, currentLine.text.length, currentLine.text.length),
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
    public static removeEmptyLinesBetweenBlockCommantAndCode = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        // return;
        const currentTextLine = Line.getTextLineFromRange(range);
        const previousTextLine = Line.getTextLineFromRange(range, -1);
        if (currentTextLine.isEmptyOrWhitespace && LineUtil.isBlockCommentEndingLine(previousTextLine.text)) {
            const lineIteration = Line.iterateNextLine(range, (line: string) => line.trim().length === 0);
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
}