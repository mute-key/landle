/**
 * this is the main module to bind functions with commands. 
 * 
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

const bindEditorCommands = () : vscode.Disposable[] => {
    return filterMapIds(EditorCommandId, (key => {
        const editorCommand = new EditorCommand();
        if (key in editorCommand) {
            return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                const args = {
                    lineEditFlag: EditorCommandId[key]
                };
                editorCommand.execute([editorCommand[key]()], false);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    }));
    
};

const bindEditorCommandGroups = () : vscode.Disposable[] => {
    const editorCommandGroup = new EditorCommandGroup();
    return filterMapIds(EditorCommandGroupId, (key => {
        if (key in editorCommandGroup) {
            return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit) => {
                const args = {
                    lineEditFlag: EditorCommandGroupId[key]
                };
                editorCommandGroup.execute(editorCommandGroup[key](), false);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    }));
};

/**
 * the function will iterate the commandID enum and bind the class function from class Command.
 * 
 * @param context extesion context.
 * @param handleLocal unused.
 * 
 * TODO:
 * now that im thinking, maybe the commandID enums can be an interface for stronger integrity.
 * it is something to check
 * 
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
    disposable.push(...bindEditorCommands());
    disposable.push(...bindEditorCommandGroups());

    // =============================================================================
    // > EDITOR EVENTS:
    // =============================================================================

    // disposable.push(vscode.window.onDidChangeWindowState((editor) => {
    // }));
    // vscode.commands.

    disposable.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            bindEditorCommands();
            bindEditorCommandGroups();
        }
    }));

    context.subscriptions.push(...disposable);
};
