import * as vscode from "vscode";
import { LineEditType } from "../editor/Line";

export namespace LineUtil {
    export const getNowDateTimeStamp = () : string => new Date().toLocaleString();

    export const removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, "");

    export const findTrailingWhiteSpaceString = (line: string): number => line.search(/\s(?=\s*$)/g);

    export const findReverseNonWhitespaceIndex = (line: string): number => line.search(/\S(?=\s*$)/g);

    export const removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

    export const getMultipleWhiteSpaceString = (line: string): RegExpMatchArray | null => line.match(/(?<=\S)\s+(?=\S)/g);
    
    export const findMultipleWhiteSpaceString = (line: string): boolean => line.search(/(?<=\S)\s+(?=\S)/g) !== -1;

    export const isLineCommented = (line: string): boolean => line.search(/^\s*\/\//g) !== -1;

    export const pushMessage = (message: string) : vscode.ProviderResult<typeof message> => {
        return vscode.window.showInformationMessage(message);
    };

    export function splitStringOn<T>(slicable: string | T[], ...indices: number[]) : (string | T[])[] {
        return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
    }

}