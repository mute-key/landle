import { EditorCommand } from "./EditorCommand";
import { LineType } from "../type/LineType.d";

/**
 * this class handles information about the editor comamnds to be bound.
 * because this class might be used to other than just editor comnand,
 * i wanted to explicitily control the editor related command so it is
 * probably the best not to inherit from other classes and use them as
 * composition.
 * 
 */
export class EditorCommandGroup extends EditorCommand {
    constructor() {
        super();
    }

    public cleanUpBlockCommentCommand = () : LineType.LineEditDefintion[] => {
        return [
            this.removeEmptyBlockCommentLineOnStart(),
            this.removeMultipleEmptyBlockCommentLine(),
            this.insertEmptyBlockCommentLineOnEnd(),
            this.blockCommentWordCountJustifyAlign(),
            this.removeEmptyLinesBetweenBlockCommantAndCode(),
        ].filter((fn) => fn !== undefined);
    };

    public cleanUpCodeCommand = () : LineType.LineEditDefintion[] => {
        return [
            this.removeDocumentStartingEmptyLine(),
            this.removeTrailingWhitespaceFromSelection(),
            this.removeMulitpleEmptyLinesFromSelection(),
            this.blockCommentWordCountJustifyAlign(),
            this.removeMultipleWhitespaceFromSelection()
        ].filter((fn) => fn !== undefined);
    };

    public cleanUpDocumentCommand = () : LineType.LineEditDefintion[] => {
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
    
    public cleanUpComments = () : LineType.LineEditDefintion[] => {
        return [
            this.removeDocumentStartingEmptyLine(),
            this.removeTrailingWhitespaceFromSelection(),
            this.removeMulitpleEmptyLinesFromSelection(),
            this.removeMultipleWhitespaceFromSelection(),
            this.removeCommentedTextFromSelection()
        ].filter((fn) => fn !== undefined);
    };
}