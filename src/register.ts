/**
 * this is the main module to bind functions with commands. 
 * 
 */
import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };
import { config, commandId } from "./common/config";

import { eventInstance } from './editor/Event';
import { EditorCommandParameterType } from './editor/EditorCommand';
import { EditorCommandGroup } from './editor/EditorCommandGroup';

const registerEvent = (context, disposable) => {
    context.subscriptions.push(disposable);
};

const defaultParam : EditorCommandParameterType = {
    includeEveryLine: false,
    autoSaveAfterEdit: config.autoSaveAfterEdit,
    editAsync: config.editAsync,
};

const registerTextEditorCommand = (context, keys, command) : vscode.Disposable[] => {
    return Object.keys(keys).map(key => {
        if (key in command) {
            const commandString = [packageInfo.name, key].join('.');
            return vscode.commands.registerTextEditorCommand(commandString, (editor, edit, params: EditorCommandParameterType = defaultParam) => {
                const fn = Array.isArray(command[key]()) ? command[key]() : [command[key]()];
                command.execute(fn , params);
            });
        } else {
            console.log('command ', key, 'has no implementation');
        }
    }) as vscode.Disposable[];
};

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    const disposable: vscode.Disposable[] = [];
    const editorCommandGroup = registerTextEditorCommand(context, commandId, new EditorCommandGroup());

    disposable.push(...editorCommandGroup);
    disposable.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            editorCommandGroup;
        }
    }));
    
    disposable.push(eventInstance.autoTriggerOnSaveEvent());
    disposable.push(eventInstance.autoTriggerOnSaveResetEvent());

    context.subscriptions.push(...disposable);
};
