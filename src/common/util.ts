import * as vscode from "vscode";

export const pushMessage = (message: string) : vscode.ProviderResult<typeof message> => {
    return vscode.window.showInformationMessage(message);
};


export const getNowDateTimeStamp = () : string => {
    return new Date().toLocaleString();
};

export const removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, "");

export const removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

export const findMultipleWhiteSpaceString = (line: string): boolean => line.search(/\s\s+/g) !== -1;

export function splitStringOn<T>(slicable: string | T[], ...indices: number[]) : (string | T[])[] {
    return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
}


