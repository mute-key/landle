import * as vscode from "vscode";

export class LineUtil {
    // #rmTrailingWhiteSpaceString = /[ \t]+$/;
    // #ifTrailingWhiteSpaceString = /\s(?=\s*$)/g;
    // #ifNonWhitespaceIndex = /\S/g;
    // #ifNonWhitespaceIndexReverse = /\S(?=\s*$)/g;
    // #rmMultipleWhiteSpaceString = /\s\s+/g;
    // #ifMultipleWhiteSpaceString = /(?<=\S)\s+(?=\S)/g;
    // #isCommented = /^\s*\/\//g;

    private constructor() {
        // this is static class 
    }

    public static getNowDateTimeStamp = () : string => {
        return new Date().toLocaleString();
    };

    public static removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, " ");
      
    public static findTrailingWhiteSpaceString = (line: string): number => line.search(/\s(?=\s*$)/g);  
      
    public static findNonWhitespaceIndex = (line: string): number => line.search(/\S/g);
      
    public static findReverseNonWhitespaceIndex = (line: string): number => line.search(/\S(?=\s*$)/g);

    public static removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");  
          
    public static findMultipleWhiteSpaceString = (line: string): boolean => line.search(/(?<=\S)\s+(?=\S)/g) !== -1;
      
    public static isLineCommented = (line: string): boolean => line.search(/^\s*\/\//g) !== -1;
      
    public static pushMessage = (message: string) : vscode.ProviderResult<typeof message> => {
        return vscode.window.showInformationMessage(message);
    };

    public static splitStringOn<T>(slicable: string | T[], ...indices: number[]) : (string | T[])[] {
        return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
    }
}