/**
 * 
 */

import * as vscode from 'vscode';

import { Command, CommandId } from './command';

export interface CommandStruct {
    command: string;
    callback: (...args: any[]) => any
    args?: any;
}

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    const disposable: vscode.Disposable[] = [];
    const command = new Command();

    disposable.push(...Object.keys(CommandId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            if (key in command) {
                return vscode.commands.registerTextEditorCommand("deco." + key,(editor, edit) => {
                    const args = { lineEditFlag: CommandId[key]};
                    command[key](editor, edit, args); // 커맨드 실행 시 args 전달
                });
            } else {
                console.log('command ', key, 'has no implementation');
            }
        }) as vscode.Disposable[]
    );

    context.subscriptions.push(...disposable);
};

