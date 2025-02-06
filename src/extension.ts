import * as vscode from 'vscode';

import { commands, ExtensionContext, window, workspace, Range, Position } from 'vscode';

import { Register } from './register';

export function activate(context: vscode.ExtensionContext) {
	Register(context);
}

export function deactivate() {
	
}