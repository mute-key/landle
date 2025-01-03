/**
 * 
 */

import * as vscode from 'vscode';
// import { Command } from './common/command';

export const Register = (
    context: vscode.ExtensionContext,
    commandList: {},
    handleLocal: boolean = true) => {
        console.log(commandList);
    // const disposable = [vscode.commands.registerCommand(commandList[0].command, commandList[0].callback, commandList[0].args)];

    // for (entry: keyof TObj in commandList) {
    //     commandList[entry: keyof TObj]; // no compiler error
    // }

    
    // const args = ;
    let disposable: vscode.Disposable[] = [];

    for (const key in commandList) {
        console.log(key);
        // const d = ;
        disposable.push(vscode.commands.registerCommand("deco." + key, commandList[key]));
        // Logic here
    }

    // let disposable = commandList.map(({ command, callback, args }) => {
    //     return vscode.commands.registerCommand(command, callback, args);
    // });
    context.subscriptions.push(...disposable);
};

