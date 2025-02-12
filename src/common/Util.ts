import * as vscode from "vscode";

export namespace LineUtil {

    export const generic = {

    };

    export const blockComment = {

    };

    export const comment = {

    };

    export const removeTrailingWhiteSpaceString = (line: string): string => line.replace(/[ \t]+$/, " ");

    export const findTrailingWhiteSpaceString = (line: string): number => line.search(/\s+$/m);

    export const findNonWhitespaceIndex = (line: string): number => line.search(/\S/g);

    export const findReverseNonWhitespaceIndex = (line: string): number => line.search(/\S(?=\s*$)/g);

    export const removeMultipleWhiteSpaceString = (line: string): string => line.replace(/\s\s+/g, " ");

    export const isMultipleWhiteSpace = (line: string): boolean => /(?<=\S)\s+\s(?=\S)/.test(line);

    export const findNextMultipleWhiteSpace = (line: string): RegExpStringIterator<RegExpExecArray> => line.matchAll(/(?<=\S)\s+\s(?=\S)/g);

    export const ifMultipleWhiteSpaceIsStringLiteral = (line: string): boolean => /(['"])\s{2,}\1/.test(line);

    export const isCommentOnlyLine = (line: string): boolean => /^\s*\/\//g.test(line);

    export const findCommentOnlyIndenetAndWhitespace = (line: string):RegExpMatchArray | null => /^\s*(\/\/\s*)/g.exec(line);

    export const isLineInlineComment = (line: string): boolean => line.startsWith('//');

    export const getInlineCommentFirstWhitespaces = (line: string): RegExpMatchArray | null => line.match(/(?<=\/\/)\s+/g);
    
    export const lineCommentWithWhitespace = (line: string): RegExpExecArray | null => /\s+\/\//g.exec(line);

    // export const lineCommentWithWhitespaceWithoutFirstWhitespace = (line: string): RegExpExecArray | null => /(?<=\s) \s+\/\//g.exec(line);
    
    // export const lineCommentWithWhitespace = (line: string): RegExpExecArray | null => /(?<=(\s+\/\/))/g.exec(line);

    export const isBlockComment2 = (line: string): boolean => line.search(/^\s*\*+\s+\S+/s) !== -1;
    
    export const isEmptyBlockComment = (line: string): boolean => /^\s*\*\s*$/.test(line);

    export const isBlockComment = (line: string): boolean => /^\s*\*+/s.test(line);

    export const isBlockCommnetDouble = (line: string): boolean => /\*.+\*/s.test(line);
    
    export const isBlockCommentWithCharacter = (line: string): boolean => /^\s*\*+\s+\S+/s.test(line);
    
    /**
     * String pattern check.
     * 
     * - if string start with dash '[-]'
     * - if comment start with '[0-9].'
     * - if comment start with '[0-9]-'
     * 
     * @param line
     * @returns boolean: true if pattern match and false otherwise.
     * 
     */
    export const checkBlockCommentNeedSkip = (line: string): boolean => /^\s*\*\s*([-]|\d+\s*[-.])\s*/s.test(line);
    // export const checkBlockCommentNeedAlign = (line: string): boolean => line.search(/^\s*\*\s*([-]|[0-9]\s*\-|[0-9]\.)\s*/s) >= 0;

    export const isBlockCommentStartingLine = (line: string): boolean => /^\s*\/\*/.test(line);

    /**
     * check if the string is block comment openning, and if following line
     * hasany characters include whitespace
     * 
     * @param line
     * @returns
     * 
     */
    export const findBlockCommentStartingLineWithCharacter = (line: string): RegExpMatchArray | null => /^\s*\/\*\*\s*\S/.exec(line);

    export const isBlockCommentStartingLineWithCharacter = (line: string): boolean => {
        const regex = /^\s*\/\*\*\s*\S/.exec(line);
        return regex !== null;
    };

    // export const isBlockCommentStartingLineWithWhitespace = (line: string): boolean => /^\s*\/\*\*\s*$/.test(line);

    export const isBlockCommentEndingLine = (line: string): boolean => /^\s*\*\//.test(line);

    export const isJSdocTag = (line: string): boolean => /^\s*\*?\s*\@.*/s.test(line);

    export const cleanBlockComment = (line: string): string => line.replace(/(?<=\*).*/, "");

    export const getlineCommentIndex = (line: string): number => line.indexOf("//");

    export const removeLineComment = (line: string): string => line.substring(0, line.indexOf("//"));

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