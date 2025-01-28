import { EditorCommand } from "./EditorCommand";
import { LineType as LT } from "./Line";

export enum EditorCommandGroupId {
    cleanUBlockCommentCommand,
    cleanUpCodeCommand,
    cleanUpDocumentCommand,
};

type CommandInterface = {
    [K in Exclude<keyof typeof EditorCommandGroupId, number>]: (...args: any[]) => void;
};

/**
 * this class handles information about the editor comamnds to be bound.
 * because this class might be used to other than just editor comnand,
 * i wanted to explicitily control the editor related command
 * so it is probably the best not to inherit from other classes and use them
 * as composition.
 * 
 */
export class EditorCommandGroup extends EditorCommand implements CommandInterface {
    constructor() {
        super();
    }
    
    public cleanUBlockCommentCommand = () : LT.LineEditDefintion[] => {
        return [
            this.removeEmptyBlockCommentLineOnStart(),
            this.removeMultipleEmptyBlockCommentLine(),
            this.insertEmptyBlockCommentLineOnEnd(),
            this.blockCommentWordCountJustifyAlign(),
            this.removeEmptyLinesBetweenBlockCommantAndCode(),
        ].filter((fn) => fn !== undefined);
    };

    public cleanUpCodeCommand = () : LT.LineEditDefintion[] => {
        return [
            this.removeDocumentStartingEmptyLine(),
            this.removeTrailingWhitespaceFromSelection(),
            this.removeMulitpleEmptyLinesFromSelection(),
            this.removeMultipleWhitespaceFromSelection()
        ];
    };

    public cleanUpDocumentCommand = () : LT.LineEditDefintion[] => {
        return [
            this.removeDocumentStartingEmptyLine(),
            this.removeTrailingWhitespaceFromSelection(),
            this.removeMulitpleEmptyLinesFromSelection(),
            this.removeMultipleWhitespaceFromSelection(),
            this.removeEmptyBlockCommentLineOnStart(),
            this.removeMultipleEmptyBlockCommentLine(),
            this.insertEmptyBlockCommentLineOnEnd(),
            this.blockCommentWordCountJustifyAlign(),
            this.removeEmptyLinesBetweenBlockCommantAndCode(),
        ].filter((fn) => fn !== undefined);
    };
    
    public cleanUpComments = () : LT.LineEditDefintion[] => {
        return [
            this.removeDocumentStartingEmptyLine(),
            this.removeTrailingWhitespaceFromSelection(),
            this.removeMulitpleEmptyLinesFromSelection(),
            this.removeMultipleWhitespaceFromSelection(),
            this.removeCommentedTextFromSelection()
        ].filter((fn) => fn !== undefined);
    };
}