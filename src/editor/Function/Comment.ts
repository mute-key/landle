import * as vscode from "vscode";
import { Line } from './Line';
import { LineUtil } from "../../common/Util";
import { LineType } from "../../type/LineType.d";
import { config } from "../../common/config";

/**
 * class handles the lines and range in editor
 *
 */
export abstract class Comment extends Line {

    /**
     * realign the block comment line here, based on base length in config
     * make the block comment almost justified aligned.
     * 
     * @param range
     * @param line
     * @returns
     * 
     */
    public static blockCommentAligned = (range: vscode.Range, line?: string[]) => {
        if (line) {
            /**
             * if the block comment was malformed and fixed previosuly.
             * this code block need to do too much at this point imo.
             * 
             */
            console.log(line)
            let indentIndex = 0;
            let indentString = '';
            let baseLine = range.start.line;
            const lineSkip: number[] = [baseLine];

            if (LineUtil.isBlockCommentStartingLineWithCharacter(line[0])) {
                indentIndex = line[0].indexOf("/*");
                indentString = '* '.padStart(indentIndex + 3, ' ');
                line[0] = line[0].replace('/*', '');
                line = line.map(str => str.replace('*', '').trim());
            } else {
                indentIndex = line[0].indexOf("/*");
                indentString = '* '.padStart(indentIndex + 3, ' ');
                line = line.map(str => str.replace('*', '').trim());
                line.shift();
            }

            const lineList = line.filter((str, index, arr) => {
                lineSkip.push(baseLine++);
                if (index > 0) {
                    const isPrevLineEmpty = (arr[index - 1].length === 0);
                    const isCurrLineEmpty = (arr[index].length === 0);

                    if (isPrevLineEmpty && isCurrLineEmpty) {
                        return false;
                    }
                }
                return true;
            }).flatMap((line): string[] => {
                if (line.length === 0) {
                    return [Line.getEndOfLine()];
                } else {
                    // .push(Line.getEndOfLine())
                    const splitLine = line.split(/\s+/);
                    splitLine.push(Line.getEndOfLine());
                    return splitLine;
                }
            });

            let newLine = indentString;
            let newString: string[] = [];
            let removeEmptyStartLine = true;
            let annotationLine = false;

            // rebuild lines
            for (const str of lineList) {
                if (str === Line.getEndOfLine()) {
                    // removes starting empty block comment
                    if (newLine !== indentString) {
                        removeEmptyStartLine = false;
                    }

                    // removes empty block comment
                    if (removeEmptyStartLine) {
                        continue;
                    }

                    if (config.of.removeWhitespaceBetweenAnnotation) {
                        if (LineUtil.isJSdocTag(newLine)) {
                            annotationLine = true;
                        }
    
                        if (annotationLine) {
                            if (newLine === indentString) {
                                continue;
                            }
                        }
                    }

                    if (newLine === indentString) {
                        newString.push(newLine + this.getEndOfLine());
                    } else {
                        newString.push(newLine.trimEnd() + this.getEndOfLine());
                    }
                    newLine = indentString;
                } else {
                    newLine += str + ' ';
                }
            }

            newString.unshift('/**'.padStart(indentIndex + 3, ' ') + this.getEndOfLine());

            // let newStringCleanUp = newString;

            // if (config.of.removeWhitespaceBetweenAnnotation && !config.of.addEmptyBlockCommentLineInAnnotation) {

            // } else if (!config.of.removeWhitespaceBetweenAnnotation && config.of.addEmptyBlockCommentLineInAnnotation) {

            // }

            // for (const [index, line] of newStringCleanUp.reverse().entries()) {
            // if (LineUtil.isBlockCommentWithCharacter(line)) {
            // newString.splice(index, newStringCleanUp.length - index);
            // break;
            // }
            // }

            // if (config.of.addExtraLineAtEndOnBlockComment) {
            // newString.push(indentString + this.getEndOfLine());
            // }

            console.log('newString', newString);

            const newRange = new vscode.Range(
                new vscode.Position(range.start.line, 0),
                new vscode.Position(range.start.line + line.length + 1, 0)
            );

            return {
                name: 'blockCommentAligned',
                range: newRange,
                type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
                string: newString.join(''),
                block: {
                    lineSkip: lineSkip,
                    priority: LineType.LineEditBlockPriority.HIGH
                }
            };

        } else {
            /**
             * if the block comment was formatted correctly within its block
             * and to see if the commentes need to be aligned.
             * 
             */
            const currTextLine: vscode.TextLine = this.getTextLineFromRange(range);
            const isCurrBlockCommentStartingLine = LineUtil.isBlockCommentStartingLine(currTextLine.text);
            let includeOpenningLine = false;
            let lineRange: vscode.Range = range;

            if (isCurrBlockCommentStartingLine) {
                if (LineUtil.isBlockCommentStartingLineWithCharacter(currTextLine.text)) {
                    includeOpenningLine = true;
                }
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
                    newString += this.getEndOfLine() + indentString;
                    newStringArr.push(this.getEndOfLine(), indentString);
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
                        return true;
                    }

                    if (LineUtil.checkBlockCommentNeedSkip(line)) {
                        return true;
                    }

                    if (LineUtil.isJSdocTag(line)) {
                        return false;
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

                const lineIteration = this.iterateNextLine(lineRange, lineCondition, continueCheck, trueConditionTask);

                for (const str of lineTextInArray) {
                    if ((newLine.length - 1) > config.of.blockCommentCharacterBoundaryBaseLength) {
                        newString += newLine.trimEnd() + this.getEndOfLine();
                        newLine = indentString;
                    }
                    newLine += str + ' ';
                }

                newString += newLine.trimEnd() + this.getEndOfLine();

                if (lineIteration) {
                    const newRange = new vscode.Range(
                        new vscode.Position(range.start.line, startPosition),
                        new vscode.Position(lineIteration.lineNumber, 0)
                    );

                    if (this.checkIfRangeTextIsEqual(newRange, newString)) {
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
            }
        };
    };

    /**
     * fix broken block commnet here, fill out comment character if the
     * formatis broken within the block.
     * 
     * @param range
     * @param indentSize
     * @returns
     * 
     */
    public static fixedBlockComment = (range: vscode.Range, indentSize: number): LineType.LineFunctionType | undefined => {

        const lineCondition = (line: string): boolean => {
            if (LineUtil.isBlockCommentEndingLine(line)) {
                return false;
            }

            return true;
        };

        const continueCheck = (line: string): boolean => {
            return true;
        };

        const trueConditionTask = (line: string) => {
            // lineTextInArray.push(...line.replaceAll("*", "").trim().split(/\s+/).filter(s => s.length > 0));
        };

        const lineModTask = (line: string): string => {
            if (LineUtil.isBlockCommentStartingLine(line)) {
                return line;
            }

            const indent = ''.padStart(indentSize + 1, ' ') + '* ';

            if (LineUtil.isBlockComment(line)) {
                if (LineUtil.isBlockCommnetDouble(line)) {
                    return indent + line.replaceAll('*', '')
                        .trimStart()
                        .split(/\s+/)
                        .filter(s => s.length > 0)
                        .join(' ');
                }

                if (line.indexOf(' *') === indentSize) {
                    return line;
                } else {
                    return indent + line.replaceAll('*', '').trimStart();
                }
            } else {
                if (line.trim().length === 0) {
                    return indent;
                } else {
                    return indent + line.trim();
                }
            }
        };

        const lineIteration = this.iterateNextLine(
            range,
            lineCondition,
            continueCheck,
            trueConditionTask,
            lineModTask);

        if (lineIteration) {
            if (lineIteration.range && lineIteration.string) {
                if (Line.checkIfRangeTextIsEqual(lineIteration.range, lineIteration.string)) {
                    return;
                }
            }
            return lineIteration;
        }
        return;
    };
}