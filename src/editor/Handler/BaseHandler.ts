import * as vscode from "vscode";

import { config } from "../../common/config";

export abstract class BaseHandler {
    protected static editor: vscode.TextEditor;

    // public abstract setActiveEditor(editor?: vscode.TextEditor): void;

    public static loadEditor = (): void => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            this.editor = activeEditor;
            return;
        }
    };
};