/**
 * this class can be broken down it seems. 
 * 
 */

import * as vscode from "vscode";

import { LineUtil } from "../common/LineUtil";

export namespace LineType {

    /**
     * this is to check if more than one edit is trying to perform the edit 
     * on overlapping range which will throw runtime error. but this is not. 
     */
    export enum LineEditCollisionGroup {
        DEFAULT = 0b0000,
        NO_RANGE_OVERLAPPING = 0b0001,
        IGNORE_ON_COLLISION = 0b0010,
        PRIORITY = 0b0100,
    }

    /**
     * bitmask to check multiple edit.type.
     * if, it comes down to editor need to perform multiple edits with single callback, 
     * this will be very useful and ActiveEditor.#editSwitch need be rewriten other than
     * switch. 
     * 
     */
    export enum LineEditType {
        APPEND = 0b00000001,
        PREPEND = 0b00000010,
        REPLACE = 0b00000100,
        CLEAR = 0b00001000,
        DELETE = 0b00100000
    };


    /**
     * detail about line edit, to be performed. 
     */
    export type LineEditInfo = {
        range: vscode.Range,
        string?: string,
        type?: LineEditType,
        block?: boolean,
        lineSkip?: number[];
    }

    /**
     * detail about line edit, to check on each line. 
     */

    export type LineEditDefintion = {
        func: (range : vscode.Range) => LineEditInfo,
        type: LineEditType,
        block? : boolean
    }
}

/**
 * class handles the lines and range in editor
 */
export class Line {
    #doc: vscode.TextDocument;
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

    /**
     * get EOL of current document set
     * 
     * @returns 
     */
    #getEndofLine = () => this.#editor?.document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

    /**
     * get text as string from range
     * 
     * @param range target range
     * @returns text as string
     */
    getText = (range: vscode.Range): string => {
        return this.#doc.getText(range);
    };

    /**
     * get TextLine object from range or from line number. 
     * 
     * @param range target range
     * @returns TextLine object of range or line.
     */
    #getTextLineFromRange = (range: vscode.Range | number, lineDelta = 0): vscode.TextLine => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(range + lineDelta);
        }

        if (range.start.line + lineDelta < 0) {
            return this.#doc.lineAt(range.start.line);    
        }

        if (this.#doc.lineCount > range.start.line + lineDelta) {
            return this.#doc.lineAt(range.start.line + lineDelta);
        } 

        return this.#doc.lineAt(range.start.line);               
    };

    /**
     * get the range of entire line including EOL.
     * 
     * @param range target range
     * @returns 
     */
    #lineFullRangeWithEOL = (range: vscode.Range): vscode.Range => {
        return this.#getTextLineFromRange(range).rangeIncludingLineBreak;
    };

    /**
     * unused. for future reference. 
     * 
     * @param range unused
     * @returns unused
     */
    #getLineNumbersFromRange = (range: vscode.Range) : { startLine: number, endLine: number } => {
        const startLine = range.start.line; 
        const endLine = range.end.line;     
        return { startLine, endLine };
    };

    /**
     * create new range with line number, starting position and end position
     * 
     * @param lineNuber line number of new range object
     * @param startPosition starting position of range
     * @param endPosition end position of range
     * @returns 
     */
    newRangeZeroBased = (lineNuber : number, startPosition : number, endPosition : number) : vscode.Range => {
        return new vscode.Range(
            new vscode.Position(lineNuber, startPosition),
            new vscode.Position(lineNuber, endPosition)
        );
    };

    /**
     * unused. for future reference. 
     * 
     * @param range unused
     * @returns unused
     */
    #editLineBindOnCondition = (range : vscode.Range, callback : LineType.LineEditDefintion, cond: boolean) : LineType.LineEditInfo | undefined => {
        return cond ? <LineType.LineEditInfo>{
            ...callback.func(this.lineFullRange(range)),
            type: callback.type
        } : undefined;
    };

    /**
     * this private function is a wrap and shape the return object for each callback for a line. 
     * the function will take current range with callback and execute to get the information 
     * how to edit the line, which described in object with type of LineEditInfo. 
     * this is where the default blocking value will be set to block additional edit on line;
     * default for blocking the edit is true, and it is false if it is not defined in callback object. 
     * this means that only a function with block:true will be executed and every other callbacks 
     * will be drop for the further.
     * 
     * @param currntRange 
     * @param fn 
     * @param _lineEdit_ 
     * @returns LineType.LineEditInfo | undefined
     */
    #editedLineInfo = (currntRange: vscode.Range, fn: LineType.LineEditDefintion): LineType.LineEditInfo | undefined => {
        const editInfo: LineType.LineEditInfo = fn.func(currntRange);
        if (editInfo) {
            if (editInfo.type) {
                return <LineType.LineEditInfo>{
                    range: editInfo.range,
                    string: editInfo?.string,
                    type: editInfo.type ? editInfo.type : fn.type,
                    block: fn.block ? true : false,
                    lineSkip: editInfo.lineSkip
                };    
            } else {
                return <LineType.LineEditInfo>{
                    ...editInfo,
                    type: fn.type,
                    block: fn.block ? true : false
                };
            }
        }
    };
    
    /**
     * this is the mian loop to iterate the callbacks that are defined from command class.
     * there is a object key named block. when the property block is true, it will drop all the 
     * added edit, and assign itself and stops further iteration to prevent no more changes to be
     * applied to that line. when the for loop is finished, it will be stacked into _line_edit_ refernce 
     * and goes into next iteration. 
     * 
     * this iteration could well have been done in array.reduce but it does unnecessary exection in the iteartion.
     * so thats why it is for loop. 
     * 
     * @param range 
     * 
     * @param callback 
     * @returns 
     * 
     */
    #callbackIteration = (range: vscode.Range, callback : LineType.LineEditDefintion[]) : LineType.LineEditInfo[] => {
        let currentLineEdit : LineType.LineEditInfo[] = [];
        for (const fn of callback) {
            const result : LineType.LineEditInfo | undefined = this.#editedLineInfo(range, fn);
            if (result) {
                if (fn.block === true) {
                    currentLineEdit = [result] as LineType.LineEditInfo[];
                    break;
                } else {
                    currentLineEdit.push(result);
                }
            }
        }
        return currentLineEdit;
    };

    /**
     * this funciton will iterate each line in recursion and stack the line edit object 
     * recursion will continue unitl the current line number is less than less than line number of
     * the each selection. the range at this point of execution will represent a single range and 
     * not entire document. callback will be a list of callbacks to check/apply to each line. 
     * _lineEdit_ variable are being used as a references so no direct assignement becuase 
     * the variable is what this function will return upon the end of the recursion. 
     * 
     * there is a for loop that will iterate each every callback. the problem with js array api is 
     * it lacks handling the undefined value being returned in single api functions rather, 
     * you have to chain them. using array api in callback object (becuase it is what it needs to 
     * iterate on), the type-mismatch forces to return either a typed object or undefined becasuse 
     * the callback will have a return type. this means the reseult of the iteration will contain undefiend 
     * item if callback returns undefined; and it makes to iterate twice to filter them for each every line. 
     * further explanation continues in function #editedLineInfo. 
     * 
     * @param range 
     * @param callback 
     * @param currentLineNumber 
     * @param _lineEdit_ 
     * @returns IterateLineType[]
     */
    #lineIteration = (range: vscode.Range, callback: LineType.LineEditDefintion[], currentLineNumber: number, _lineEdit_: LineType.LineEditInfo[], lineSkip?: Set<number>): LineType.LineEditInfo[] => {
        lineSkip = lineSkip ?? new Set();
    
        while (currentLineNumber <= range.end.line) {
            if (lineSkip.has(currentLineNumber)) {
                currentLineNumber++;
                continue;
            }
    
            const currentLineEdit = this.#callbackIteration(this.lineFullRange(currentLineNumber), callback);
            if (currentLineEdit.length > 0) {
                if (currentLineEdit[0].lineSkip) {
                    currentLineEdit[0].lineSkip.forEach(line => lineSkip.add(line));
                }
                _lineEdit_.push(...currentLineEdit);
            }
            currentLineNumber++;
        }
    
        return _lineEdit_;
    };

    // =============================================================================
    // > PROTECTED FUNCTIONS: 
    // =============================================================================

    /**
     * get the range of line with any characters including whitespaces. 
     * 
     * @param range vscode.Range | number. 
     * @returns first line of the range or whole line of the the line number.
     */
    protected lineFullRange = (range: vscode.Range | number): vscode.Range => {
        if (typeof range === 'number') {
            return this.#doc.lineAt(<number>range).range;
        }
        return this.#doc.lineAt(range.start.line).range;
    };
    
    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    /**
     * take range as a single selection that could be a single line, empty (cursor only) 
     * or mulitple lines. the callback will be defined in Command.ts. this function will return 
     * either a single LineEditInfo or array of them to schedule the document edit. 
     * if the selection is either of empty (whitespaces only) or a single line, the 
     * range should be the whole line. 
     * 
     * @param range 
     * @param callback 
     * @returns 
     */
    public prepareLines = (range: vscode.Range, callback: LineType.LineEditDefintion[]): LineType.LineEditInfo[] => {
        const targetLine = range.start.line;
        
        // on each selection, starting line is: isEmpty or if selection is singleLine 
        if (range.isEmpty || range.isSingleLine) {
            return this.#callbackIteration(this.lineFullRange(targetLine), callback);
        }

        return this.#lineIteration(
            range,
            callback,
            targetLine,
            <LineType.LineEditInfo[]>[]);
    };

    /**
     * remove trailing whitespace lines from range if there is non-whitespace-character present. 
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     */

    public removeTrailingWhiteSpace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const textString = this.getText(range);
        const whitespacePos: number = LineUtil.findTrailingWhiteSpaceString(textString);
        if (whitespacePos >= 0) {
            const textLineLength = (textString.length);
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
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     */
    public removeMultipleWhitespace = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.findMultipleWhiteSpaceString(lineText) && !this.#getTextLineFromRange(range).isEmptyOrWhitespace) {
            const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
            // also need to check if the line has indent
            const startPos = this.#getTextLineFromRange(range).firstNonWhitespaceCharacterIndex;
            const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
            return {
                range: this.newRangeZeroBased(range.start.line, startPos, endPos),
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
     */
    public removeMulitpleEmptyLine = (range: vscode.Range): LineType.LineEditInfo | undefined => {
        const currentLine = this.#getTextLineFromRange(range).isEmptyOrWhitespace;
        const nextLine = this.#getTextLineFromRange(range, 1).isEmptyOrWhitespace;
        if (currentLine && nextLine) {
            return {
                range: this.#lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    /**
     * remove line if the line is commented
     * 
     * @param range target range
     * @returns object descripting where/how to edit the line or undefined if no condition is met.
     */
    public removeCommentedLine = (range: vscode.Range) : LineType.LineEditInfo | undefined => {
        const lineText = this.getText(range);
        if (LineUtil.isLineCommented(lineText)) {
            return {
                range: this.#lineFullRangeWithEOL(range)
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
        const currentLine = this.#getTextLineFromRange(range).isEmptyOrWhitespace;
        if (currentLine) {
            return {
                range: this.#lineFullRangeWithEOL(range)
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
        const currentLine = this.#getTextLineFromRange(range);
        const nextLine = this.#getTextLineFromRange(range, 1);
        if (currentLine.text === nextLine.text) {
            return {
                range: this.#lineFullRangeWithEOL(range)
            };
        }
        return;
    };

    public cleanUpBlockCommentLine = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        const EOL = this.#getEndofLine();
        const currentLine : vscode.TextLine = this.#getTextLineFromRange(range);
        const before2Line : vscode.TextLine = this.#getTextLineFromRange(range, -2);
        const beforeLine : vscode.TextLine = this.#getTextLineFromRange(range, -1);
        const blockCommentStart : boolean  = LineUtil.isBlockCommentStartingLine(beforeLine.text);
        const nextLine : vscode.TextLine  = this.#getTextLineFromRange(range, 1);
        const nextLineIsBlockCommend  : boolean  = LineUtil.isEmptyBlockComment(nextLine.text);
        const NextLineblockCommentEnd : boolean = LineUtil.isBlockCommentEndingLine(nextLine.text);
        const LineIsBlockCommend : boolean = LineUtil.isEmptyBlockComment(currentLine.text);

        if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
            let ln = range.start.line;
            let rg ;            
            let tl;
            const lineSkip : number[] = [];
            while(ln) {
                tl = this.#getTextLineFromRange(ln);
                if (LineUtil.isEmptyBlockComment(tl.text)) {
                    rg = tl.range;
                    lineSkip.push(ln);
                } else {
                    break;
                }
                ln++;
            }
            return {
                range: new vscode.Range(
                    new vscode.Position(range.start.line, 0),
                    new vscode.Position(rg.start.line + 1, 0)
                ),
                lineSkip: lineSkip
            };
        } 
        else if (NextLineblockCommentEnd && LineUtil.isBlockComment(currentLine.text)) {
            return {
                range: this.newRangeZeroBased(range.start.line, currentLine.text.length, currentLine.text.length),
                string: EOL + LineUtil.cleanBlockComment(currentLine.text) + " ",
                type: LineType.LineEditType.APPEND
            };
        } else if ((LineIsBlockCommend && nextLineIsBlockCommend)) {
            return {
                range: this.#lineFullRangeWithEOL(range)
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
     */
    public setNowDateTimeOnLine = (range : vscode.Range) : LineType.LineEditInfo | undefined => {
        return {
            range: range,
            string: LineUtil.getNowDateTimeStamp.custom()
        };;
    };    
}

