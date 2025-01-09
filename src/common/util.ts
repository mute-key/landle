import * as vscode from "vscode";
import { LineEditType } from "../editor/Line";

export class LineUtil {

    private constructor() {
        // this class 
    }

    public static getNowDateTimeStamp = () : string => {
        return new Date().toLocaleString();
    };

    public static removeTrailingWhiteSpaceString = (line: string): string => {
        return line.replace(/[ \t]+$/, "");
    };

    public static findTrailingWhiteSpaceString = (line: string): number => {
        return line.search(/\s(?=\s*$)/g);
    };

    public static findReverseNonWhitespaceIndex = (line: string): number => {
        return line.search(/\S(?=\s*$)/g);
    };

    public static removeMultipleWhiteSpaceString = (line: string): string => {
        return line.replace(/\s\s+/g, " ");
    };

    public static getMultipleWhiteSpaceString = (line: string): RegExpMatchArray | null => {
        return line.match(/(?<=\S)\s+(?=\S)/g);
    };
    
    public static findMultipleWhiteSpaceString = (line: string): boolean => {
        return line.search(/(?<=\S)\s+(?=\S)/g) !== -1;
    };

    public static isLineCommented = (line: string): boolean => {
        return line.search(/^\s*\/\//g) !== -1;
    };

    public static pushMessage = (message: string) : vscode.ProviderResult<typeof message> => {
        return vscode.window.showInformationMessage(message);
    };

    public static splitStringOn<T>(slicable: string | T[], ...indices: number[]) : (string | T[])[] {
        return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
    }

}