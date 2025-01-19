import { EditorCommand } from "./EditorCommand";
import { LineType as LT } from "./Line";

export enum EditorCommandGroupId {
    cleanUpDocumentCommand, 
    cleanUBlockCommentCommand
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
export class EditorCommandGroup implements CommandInterface {
    #editorCommand;
    constructor() {
        this.#editorCommand = new EditorCommand();
    }   

    public cleanUpDocumentCommand = () : LT.LineEditDefintion[] => {
        return [
            this.#editorCommand.removeDocumentStartingEmptyLine(),
            this.#editorCommand.removeTrailingWhitespaceFromSelection(),
            this.#editorCommand.removeMulitpleEmptyLinesFromSelection(),
            this.#editorCommand.removeMultipleWhitespaceFromSelection(),
            this.#editorCommand.removeEmptyBlockCommentLineOnStart(), 
            this.#editorCommand.removeMultipleEmptyBlockCommentLine(), 
            this.#editorCommand.insertEmptyBlockCommentLineOnEnd(), 
            this.#editorCommand.removeEmptyLinesBetweenBlockCommantAndCode(), 
        ];
    };
    public cleanUBlockCommentCommand = () : LT.LineEditDefintion[] =>  {
        return [
            this.#editorCommand.removeEmptyBlockCommentLineOnStart(), 
            this.#editorCommand.removeMultipleEmptyBlockCommentLine(), 
            this.#editorCommand.insertEmptyBlockCommentLineOnEnd(), 
            this.#editorCommand.removeEmptyLinesBetweenBlockCommantAndCode(), 
        ];
    };

    
}