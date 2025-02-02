/**
 * this is the main module to bind functions with commands. 
 * 
 */
import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };
import config from "./common/config";

import {
    event
} from './editor/event';

import {
    EditorCommandParameterType,
    EditorCommand,
    EditorCommandId
} from './editor/EditorCommand';

import {
    EditorCommandGroup,
    EditorCommandGroupId
} from './editor/EditorCommandGroup';

const defaultParam : EditorCommandParameterType = {
    includeEveryLine: false,
    autoSaveAfterEdit: config.autoSaveAfterEdit
};

const bindEditorCommands = (context) : vscode.Disposable[] => {
    return filterMapIds(EditorCommandId, (key => {
        const editorCommand = new EditorCommand();
        if (key in editorCommand) {
            return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit, params: EditorCommandParameterType = defaultParam) => {
                // const args = {
                //     lineEditFlag: EditorCommandId[key]
                // };
                editorCommand.execute([editorCommand[key]()], params);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    }));
};

const bindEditorCommandGroups = (context) : vscode.Disposable[] => {
    const editorCommandGroup = new EditorCommandGroup();
    return filterMapIds(EditorCommandGroupId, (key => {
        if (key in editorCommandGroup) {
            return vscode.commands.registerTextEditorCommand(packageInfo.name + '.' + key, (editor, edit, params: EditorCommandParameterType = defaultParam) => {
                // const args = {
                //     lineEditFlag: EditorCommandGroupId[key]
                // };
                editorCommandGroup.execute(editorCommandGroup[key](), params);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    }));
};

/**
 * the function will iterate the commandID enum and bind the class function 
 * from class Command. 
 * 
 * @param context extesion context.
 * @param handleLocal unused.
 * 
 * for stronger integrity. it is something to check 
 * 
 */
const filterMapIds = (ids, mapCallback) => {
    return Object.keys(ids)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(mapCallback) as vscode.Disposable[];
};

const registerEvent = (context, disposable) => {
    context.subscriptions.push(disposable);
};

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    const disposable: vscode.Disposable[] = [];

    disposable.push(...bindEditorCommands(context));
    disposable.push(...bindEditorCommandGroups(context));
    disposable.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            bindEditorCommands(context);
            bindEditorCommandGroups(context);
        }
    }));
    
    event.isDirectCall();
    disposable.push(event.autoTriggerOnSaveEvent());
    disposable.push(event.autoTriggerOnSaveResetEvent());

    context.subscriptions.push(...disposable);
};
