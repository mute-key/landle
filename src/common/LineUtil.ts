import * as vscode from "vscode";
import { Line } from "../editor/Line";

export class LineUtil {
    private constructor() {
        // this is static class
    }
    
    public static removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, " ");

    public static findTrailingWhiteSpaceString = (line: string): number => line.search(/\s+$/s);

    public static findNonWhitespaceIndex = (line: string): number => line.search(/\S/g);

    public static findReverseNonWhitespaceIndex = (line: string): number => line.search(/\S(?=\s*$)/g);

    public static removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

    public static findMultipleWhiteSpaceString = (line: string): boolean => line.search(/(?<=\S)\s+\s(?=\S)/) !== -1;

    public static isLineCommented = (line: string): boolean => line.search(/^\s*\/\//g) !== -1;
    
    public static isEmptyBlockComment = (line: string) : boolean => line.search(/^\s*\*\s*$/s) !== -1;

    public static isBlockComment = (line: string) : boolean => line.search(/^\s*\*+\s+\S+/s) !== -1;
    
    public static isBlockCommentStartingLine = (line: string) : boolean => line.search(/^\s*\/.*\s*$/) !== -1;

    public static isBlockCommentEndingLine = (line: string) : boolean => line.search(/^\s*\*\//) !== -1;

    public static isJSdocTag = (line: string) : boolean => line.search(/^\s*\*?\s*\@.*/s) !== -1;

    public static cleanBlockComment = (line: string) : string => line.replace(/(?<=\*).*/, "");

    public static getlineCommentIndex = (line : string) : number => line.indexOf("//");

    public static removeLineComment = (line : string) : string => line.substring(0, line.indexOf("//"));

    public static pushMessage = (message: string): vscode.ProviderResult<typeof message> => {
        return vscode.window.showInformationMessage(message);
    };

    public static splitStringOn<T>(slicable: string | T[], ...indices: number[]): (string | T[])[] {
        return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
    }

    public static getNowDateTimeStamp = ((): { locale: () => string, iso: () => string, custom: () => string } => ({
        custom: () => {
            function formatDate(date: Date): string {
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                };
            
                const locale = Intl.DateTimeFormat().resolvedOptions().locale;
                const formatter = new Intl.DateTimeFormat(locale, options);
                const parts = formatter.formatToParts(date);
            
                let year = '', month = '', day = '', hour = '', minute = '', ampm = '';
                
                parts.forEach(part => {
                    switch (part.type) {
                        case 'year':
                            year = part.value; break;
                        case 'month':
                            month = part.value; break;
                        case 'day':
                            day = part.value; break;
                        case 'hour':
                            hour = part.value; break;
                        case 'minute':
                            minute = part.value; break;
                        case 'dayPeriod':
                            ampm = part.value.toUpperCase(); break;
                    }
                });
            
                return `${year}-${month}-${day} (${hour}:${minute} ${ampm})`;
            }
            
            const currentDate = new Date();
            return formatDate(currentDate);
        },
        locale: () => new Date().toLocaleString(),
        iso: () => new Date().toISOString()
    }))();
}