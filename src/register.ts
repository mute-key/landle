/**
 * this is the main module to bind functions with commands. 
 */

import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };

import {
    EditorCommand,
    EditorCommandId
} from './editor/EditorCommand';

import {
    EditorCommandGroup,
    EditorCommandGroupId
} from './editor/EditorCommandGroup';

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
    const combinedCommandIds = [
        ...Object.keys(EditorCommandId), 
        ...Object.keys(EditorCommandGroupId)]; 

    /**
     * if this extension need more features other than editor, 
     * this iteration canb be wrapped in callback and be used from 
     * other command list enum if the command changes. 
     * 
     */
    const editorCommand = new EditorCommand();
    disposable.push(...Object.keys(EditorCommandId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            if (key in editorCommand) {
                return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                    const args = { 
                        lineEditFlag: EditorCommandId[key] 
                    };
                    editorCommand.execute([editorCommand[key](editor, edit, args)], false);
                });
            } else {
                console.log('command ', key, 'has no implementation');
            }
        }) as vscode.Disposable[]
    );

    const editorCommandGroup = new EditorCommandGroup();
    disposable.push(...Object.keys(EditorCommandGroupId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            if (key in editorCommandGroup) {
                return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                    const args = { 
                        lineEditFlag: EditorCommandGroupId[key] 
                    };
                    editorCommandGroup.execute(editorCommandGroup[key](editor, edit, args), false);
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

