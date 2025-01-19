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

const filterMapIds = (ids, mapCallback) => {
    return Object.keys(ids)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(mapCallback) as vscode.Disposable[];
};

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
    const editorCommand = new EditorCommand();
    const editorCommandGroup = new EditorCommandGroup();


    disposable.push(...filterMapIds(EditorCommandId,(key => {
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
    })));

    disposable.push(...filterMapIds(EditorCommandGroupId,(key => {
        if (key in editorCommandGroup) {
            return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                const args = { 
                    lineEditFlag: EditorCommandGroupId[key] 
                };
                editorCommand.execute(editorCommandGroup[key](editor, edit, args), false);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    })));

    
    // =============================================================================
    // > EDITOR EVENTS: 
    // =============================================================================

    // disposable.push(vscode.window.onDidChangeWindowState((editor) => {
    // }));

    // disposable.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
    // }));

    context.subscriptions.push(...disposable);
};

