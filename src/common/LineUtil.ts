import * as vscode from "vscode";
import { Line } from "../editor/Line";

// asdasdasdasdasd

export namespace LineUtil {
    export const removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, " ");

    export const findTrailingWhiteSpaceString = (line: string): number => line.search(/\s+$/m);

    export const findNonWhitespaceIndex = (line: string): number => line.search(/\S/g);

    export const findReverseNonWhitespaceIndex = (line: string): number => line.search(/\S(?=\s*$)/g);

    export const removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

    export const findMultipleWhiteSpaceString = (line: string): boolean => line.search(/(?<=\S)\s+\s(?=\S)/) !== -1;

    export const isLineCommented = (line: string): boolean => line.search(/^\s*\/\//g) !== -1;

    export const isLineInlineComment = (line: string): boolean => line.startsWith('//');

    export const getInlineCommentFirstWhitespaces = (line: string) => line.match(/(?<=\/\/)\s+/g);

    export const isEmptyBlockComment = (line: string): boolean => line.search(/^\s*\*\s*$/s) !== -1;

    export const isBlockComment = (line: string): boolean => line.search(/^\s*\*+\s+\S+/s) !== -1;

    export const isBlockCommentStartingLine = (line: string): boolean => line.search(/^\s*\/.*\s*$/) !== -1;

    export const isBlockCommentEndingLine = (line: string): boolean => line.search(/^\s*\*\//) !== -1;

    export const isJSdocTag = (line: string): boolean => line.search(/^\s*\*?\s*\@.*/s) !== -1;

    export const cleanBlockComment = (line: string): string => line.replace(/(?<=\*).*/, "");

    export const getlineCommentIndex = (line: string): number => line.indexOf("//");

    export const removeLineComment = (line: string): string => line.substring(0, line.indexOf("//"));

    export const pushMessage = (message: string): vscode.ProviderResult<typeof message> => {
        return vscode.window.showInformationMessage(message);
    };

    // export const splitStringOn<T>(slicable: string | T[], ...indices: number[]): (string | T[])[] {
    // return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
    // }

    export const getNowDateTimeStamp = ((): { locale: () => string, iso: () => string, custom: () => string } => ({
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