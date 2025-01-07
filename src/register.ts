/**
 * 
 */

import * as vscode from 'vscode';

import { ActiveEditor } from './editor/ActiveEditor';


enum CommandId {
    removeTrailingWhitespaceFromSelection,
    removeMulitpleEmptyLinesFromSelection,
    removeEmptyLinesFromSelection,
    removeMultipleWhitespace,
    cleanUpWhitespace,
    printNowDateTime,
    test

    // commentBlock = "commentBlock",
    // addToTitle = "addToTitle",
    // createSection = "createSection",
    // cleanWhiteSpaceLines = "cleanWhiteSpaceLines",
    // removeLine = "removeLine",
    // addDateStamp = "addDateStamp",
    // addTimeStamp = "addTimeStamp",
};

export interface CommandStruct {
    command: string;
    callback: (...args: any[]) => any
    args?: any;
}

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    const disposable: vscode.Disposable[] = [];
    const activeEditor = new ActiveEditor();

    disposable.push(...Object.keys(CommandId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            // console.log('command ', activeEditor[key], 'has implementation');
            if (key in activeEditor) {
                return vscode.commands.registerTextEditorCommand("deco." + key, activeEditor[key]);
            } else {
                console.log('command ', key, 'has no implementation');
            }
        }) as vscode.Disposable[]
    );

    context.subscriptions.push(...disposable);
};

