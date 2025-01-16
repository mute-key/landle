/**
 * this is the main module to bind functions with commands. 
 */

import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };

import {
    Command,
    EditorCommandId
} from './command';


/**
 * the function will iterate the commandID enum and bind the class function from class Command. 
 * 
 * @param context extesion context. 
 * @param handleLocal unused. 
 * 
 * 
 * TODO:
 * now that im thinking, maybe the commandID enums can be an interface for stronger integrity. 
 * it is something to check
 */

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {
    
    const disposable: vscode.Disposable[] = [];
    
    /**
     * if this extension need more features other than editor, 
     * this iteration canb be wrapped in callback and be used from 
     * other command list enum if the command changes. 
     * 
     */
    const command = new Command();
    disposable.push(...Object.keys(EditorCommandId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            if (key in command) {
                return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                    const args = { lineEditFlag: EditorCommandId[key] };
                    command[key](editor, edit, args);
                });
            } else {
                console.log('command ', key, 'has no implementation');
            }
        }) as vscode.Disposable[]
    );

    // =============================================================================
    // > EDITOR EVENTS: 
    // =============================================================================

    // disposable.push(vscode.window.onDidChangeWindowState((editor) => {
    // }));

    // disposable.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
    // }));

    context.subscriptions.push(...disposable);
};

