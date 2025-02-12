import * as vscode from 'vscode';

export namespace LineType {

    /**
     * bitmask to check multiple edit.type. if, it comes down to editor
     * need to perform multiple edits with single callback, this will be
     * very useful and ActiveEditor.#editSwitch need be rewriten other
     * than switch.
     * 
     * - asdasd
     * - asdasdasd
     *
     */
    export const enum LineEditType {
        APPEND = 1 << 0,
        PREPEND = 1 << 1,
        REPLACE = 1 << 2,
        CLEAR = 1 << 3,
        DELETE = 1 << 4
    }

    export const enum RangeKind {
        DOCUMENT = 1 << 0,
        MULTILINE = 1 << 1,
        LINE = 1 << 2
    }

    /**
     * this is to check if more than one edit is trying to perform the edit
     * on overlapping range which will throw runtime error. but this is
     * not.
     *
     */
    export const enum LineEditBlockPriority {
        UNSET = 0,
        LOW = 1,
        MID = 2,
        HIGH = 3,
        VERYHIGH = 4,
        SKIP_LINE = 5
    }

    /**
     * type of to check the priority of which edit to perform as well as
     * if the block requires to skip lines.
     *
     */
    export type lineEditBlockType = {
        priority: LineEditBlockPriority
        lineSkip?: number[],
    }

    /**
     * detail about line edit, to be performed.
     *
     */
    export type LineEditInfo = {
        range: vscode.Range,
        string?: string,
        type?: LineEditType,
        block?: lineEditBlockType
        name?: string,
    }

    /**
     * detail about line edit, to check on each line.
     *
     */
    export type LineEditDefintion = {
        func: (range: vscode.Range) => LineEditInfo | undefined,
        type: LineEditType,
        block?: lineEditBlockType
    }

    export type IterateNextLineType = {
        lineNumber: number,
        lineSkip: number[],
        
    }

    export type LineFunctionType = {
        range?: vscode.Range;
        string?: string;
    } & IterateNextLineType;
}