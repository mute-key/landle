/**
 * 
 */

import * as vscode from 'vscode';
import packageInfo from '../package.json' assert { type: 'json' };

import { 
    Command, 
    CommandId 
} from './command';

export interface CommandStruct {
    command: string;
    callback: (...args: any[]) => any
    args?: any;
}

export const Register = (
    context: vscode.ExtensionContext,
    handleLocal: boolean = true) => {

    console.log('packageInfo.name', packageInfo.name);
    const disposable: vscode.Disposable[] = [];
    const command = new Command();

    disposable.push(...Object.keys(CommandId)
        .filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key))
        .map(key => {
            if (key in command) {
                return vscode.commands.registerTextEditorCommand("lindle." + key,(editor, edit) => {
                    const args = { lineEditFlag: CommandId[key]};
                    command[key](editor, edit, args); 
                });
            } else {
                console.log('command ', key, 'has no implementation');
            }
        }) as vscode.Disposable[]
    );

    context.subscriptions.push(...disposable);
};

