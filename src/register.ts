/**
 * this is the main module to bind functions with commands.
 * 
 */
import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };

import { config } from "./common/config";
import { eventInstance } from './editor/Event';
import { EditorCommandParameterType, editorCommandId } from './editor/EditorCommand';
import { EditorCommandGroup } from './editor/EditorCommandGroup';

const defaultParam : EditorCommandParameterType = {
    includeEveryLine: false,
    autoSaveAfterEdit: config.of.autoSaveAfterEdit,
    editAsync: config.of.editAsync,
};

const registerTextEditorCommand = (context, commandId : string[], command) : vscode.Disposable[] => {
    return commandId.map((id) => {
        if (id in command) {
            const commandString = [packageInfo.name, id].join('.');
            return vscode.commands.registerTextEditorCommand(commandString, (editor, edit, params: EditorCommandParameterType = defaultParam) => {
                const fn = Array.isArray(command[id]()) ? command[id]() : [command[id]()];
                command.execute(fn , params);
            });
        } else {
            console.log('command ', id, 'has no implementation');
        }
    }) as vscode.Disposable[];
};

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    const disposable: vscode.Disposable[] = [];
    const editorCommandGroup = registerTextEditorCommand(context, editorCommandId, new EditorCommandGroup());

    disposable.push(...editorCommandGroup);
    disposable.push(eventInstance.onDidChangeConfiguration());
    disposable.push(eventInstance.autoTriggerOnSaveEvent());
    disposable.push(eventInstance.autoTriggerOnSaveResetEvent());

    context.subscriptions.push(...disposable);
};