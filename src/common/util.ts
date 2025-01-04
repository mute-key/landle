import * as vscode from "vscode";

export const pushMessage = (message: string) : vscode.ProviderResult<typeof message> => {
    return vscode.window.showInformationMessage(message);
};

export const getEditor = () => {
    return vscode.window.activeTextEditor;
};

export const DateStamp = () => {
    return new Date().toLocaleString();
};

export const removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, "");

export const removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

export const splitStringOn: {
    <T = string>(s: T, ...i: number[]): 
    T[]; 
    <T extends any[]>(s: T, ...i: number[]): T[]; 
} = <T>(slicable: string | T[], ...indices: number[]) => [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));


