import * as vscode from 'vscode';

export namespace LineAysncType {
    export type LineEditDefintion = {
        func: (range: vscode.Range) => any
    }
}

export class LineAysnc {

    protected editor: vscode.TextEditor;
    protected line: Map<number, string> = new Map();

    constructor() {
        this.#setActiveEditor();
    }
    #setActiveEditor = (): void => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            this.editor = activeEditor;
        } else {
            return;
        }
    };

    #parseEditor = (start: number, end: number) => {
        let line = this.editor.document.lineCount;
        while (line--) {
            this.line.set(line, this.editor.document.lineAt(line).text);
        }
    };

    /**
     * @param range
     * @param callback
     * 
     */
    public prepareLines = (range: vscode.Range, callback: any[]) : void => {
        // 1. no selection but only cursor on line.
        // 2. no selection but want to perform on editor.
        // 3. selection but range.
        // 4. all document selected.
        let start = 0, end = 0;

        if (range.isEmpty || range.isSingleLine) {
            start = range.start.line;
            end = range.end.line;
        }

        this.#parseEditor(start, end);

        // return this.#lineIteration(
        //     range,
        //     callback,
        //     targetLine,
        //     <LineType.LineEditInfo[]>[]);
    };
}