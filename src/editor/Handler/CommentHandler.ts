import * as vscode from "vscode";
import { Line } from "../Function/Line";
import { Comment } from "../Function/Comment";
import { LineUtil } from "../../common/Util";
import { BaseHandler } from "./BaseHandler";
import { LineType } from "../../type/LineType.d";

export abstract class CommentHandler extends BaseHandler {

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

        if (currLineIsBlockCommend && nextLineIsBlockCommend && !prevLineblockCommentStart) {
            return {
                name: 'removeMultipleEmptyBlockCommentLine',
                range: Line.lineFullRangeWithEOL(range)
            };
        }

        // LineUtil.isJSdocTag(previousLine.text)

        // // previous line is unclosed block comment but random whitespace line appear in block comment.
        // if (LineUtil.isBlockCommentWithCharacter(previousLine.text) && previousLine.isEmptyOrWhitespace) {
        // console.log('removeMultipleEmptyBlockCommentLine1', currentLine.lineNumber, currentLine.text)

        // if (!isCurrLineJsDoc) {

        // } else if (isCurrLineJsDoc) {

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
        const prevLine: vscode.TextLine = Line.getTextLineFromRange(range, -1);
        const currLine: vscode.TextLine = Line.getTextLineFromRange(range);
        const currLineblockCommentEnd: boolean = LineUtil.isBlockCommentEndingLine(currLine.text);
        const prevLineblockCommentNonEmpty: boolean = LineUtil.isBlockCommentWithCharacter(prevLine.text);
        const indent = '*'.padStart(prevLine.text.indexOf('*') + 1, ' ');
        const newLine = indent + ' ' + Line.getEndOfLine() + indent + '/' + Line.getEndOfLine();

        if (currLineblockCommentEnd && prevLineblockCommentNonEmpty) {
            return {
                name: 'insertEmptyBlockCommentLineOnEnd',
                range: new vscode.Range(
                    new vscode.Position(range.start.line, 0),
                    new vscode.Position(range.start.line + 1, 0)
                ),
                string: newLine
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

    public static fixBrokenBlockComment = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currTextLine: vscode.TextLine = Line.getTextLineFromRange(range);
        if (LineUtil.isBlockCommentStartingLine(currTextLine.text)) {
            const fixedComment = Comment.fixedBlockComment(range, currTextLine.text.indexOf('/*'));
            if (fixedComment) {
                return {
                    name: 'fixBrokenBlockCommnet',
                    range: new vscode.Range(
                        new vscode.Position(range.start.line, 0),
                        new vscode.Position(fixedComment.lineNumber, 0)
                    ),
                    string: fixedComment.string,
                    type: LineType.LineEditType.REPLACE,
                    block: {
                        lineSkip: fixedComment.lineSkip,
                        priority: LineType.LineEditBlockPriority.HIGH
                    }
                };
            }
        }

        return;
    };

    /**
     * @param range
     * @returns
     * 
     */
    public static blockCommentWordCountJustifyAlign = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const fixedBlockComment = this.fixBrokenBlockComment(range);
        if (fixedBlockComment) {
            return Comment.blockCommentAligned(range, fixedBlockComment.string?.split(Line.getEndOfLine()).filter(s => s.length > 0));
        } else {
            return Comment.blockCommentAligned(range);
        }
        return;
    };
}