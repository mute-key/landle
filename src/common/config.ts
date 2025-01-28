import * as vscode from "vscode";
import packageInfo from '../../package.json' assert { type: 'json' };

const config = vscode.workspace.getConfiguration(packageInfo.name);

export const addExtraLineAtEndOnBlockComment = config.get<boolean>('addExtraLineAtEndOnBlockComment', true);

export const deleteCommentAlsoDeleteBlockComment = config.get<boolean>('deleteCommentAlsoDeleteBlockComment', true);

export const blockCommentWordCountAutoLengthAlign = config.get<boolean>('blockCommentWordCountAutoLengthAlign', true);

export const BaseLength = config.get<number>('blockCommentCharacterBoundaryBaseLength', 70);

export const ToleanceLength = config.get<number>('blockCommentCharacterBoundaryTolanceLength', 5);
