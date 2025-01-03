import * as vscode from "vscode";

export const pushMessage = (message: string) => {
    vscode.window.showInformationMessage(message);
};

export const getEditor = () => {
    return vscode.window.activeTextEditor;
};

export const DateStamp = () => {
    return new Date().toLocaleString();
};

export const removeTrailingWhiteSpaceString = (line: string) => line.replace(/[ \t]+$/, ""); 


