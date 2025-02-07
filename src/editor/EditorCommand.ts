/**
 * this is kind of generic command class but for editor. it might need
 * to be refactored if to be used other than just editor edit. probably
 * will need to revise to make it either even more generic or even more
 * to specific use-case.
 * 
 * 이거 다시쓰자. 조합하기가 너무 번거롭다.
 * 
 */
import { ActiveEditor } from "./ActiveEditor";
import { LineType } from "./Handler/Line";
import { LineHandler } from "./Handler/LineHandler";
import { config } from "../common/config";
import packageInfo from '../../package.json' assert { type: 'json' };

export type EditorCommandParameterType = {
    editAsync: boolean,
    includeEveryLine: boolean,
    autoSaveAfterEdit: boolean
}

export const editorCommandId: string[] = (() => {
    return packageInfo.contributes.commands.map(c => {
        const cArray = c.command.split('.');
        return cArray[1];
    });
})();

/**
 * this class handles information about the editor comamnds to be bound.
 * becausethis class might be used to other than just editor comnand, i
 * wantedto explicitily control the editor related command so it is probably
 * thebest not to inherit from other classes and use them as composition.
 * 
 */
export class EditorCommand {
    #activeEditor: InstanceType<typeof ActiveEditor>;
    #lineHandler: InstanceType<typeof LineHandler>;

    constructor() {
        this.#lineHandler = new LineHandler();
        this.#activeEditor = new ActiveEditor();
        this.#activeEditor.setLineHandler(this.#lineHandler);
    }

    // =============================================================================
    // > PUBLIC FUNCTIONS:
    // =============================================================================

    public execute = (command: LineType.LineEditDefintion[], commandOption: EditorCommandParameterType): void => {
        this.#activeEditor.prepareEdit(command, commandOption);
    };

    /**
     * @returns
     * 
     */
    public removeDocumentStartingEmptyLine = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeDocumentStartingEmptyLine,
            type: LineType.LineEditType.DELETE
        };
    };

    /**
     * removes trailing whitespace from the line.
     *
     * @param editor unused, future reference
     * @param edit unused, future reference
     * @param args unused, future reference
     * 
     */
    public removeTrailingWhitespaceFromSelection = (editor?, edit?, args?): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeTrailingWhiteSpace,
            type: LineType.LineEditType.DELETE
        };
    };

    /**
     * removes multiple empty lines with EOL. this function will check if
     * thecurrnt range and next range are both whitespace lines and if true,
     * deletecurrent range with EOL. function type is
     * 
     */
    public removeMulitpleEmptyLinesFromSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeMulitpleEmptyLine,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.MID
            }
        };
    };

    /**
     * removes whitespaces that are longer than 1. this function will ignore
     * indentation and keep the indent.
     * 
     */
    public removeMultipleWhitespaceFromSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeMultipleWhitespace,
            type: LineType.LineEditType.REPLACE,
        };
    };

    /**
     * remove all empty whitespace lines from selection function type is
     * line.delete.
     * 
     */
    public removeEmptyLinesFromSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeEmptyLine,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.LOW
            }
        };
    };

    /**
     * remove all commented lines from selection function type is line.delete
     * with EOL.
     * 
     */
    public removeCommentedTextFromSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeCommentedLine,
            type: LineType.LineEditType.DELETE,
        };
    };

    /**
     * remove the current line if next line is identical as the current
     * one.
     * 
     */
    public removeDuplicateLineFromSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeDuplicateLine,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.LOW
            }
        };
    };

    public removeEmptyBlockCommentLineOnStart = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeEmptyBlockCommentLineOnStart,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.VERYHIGH
            }
        };
    };

    public removeMultipleEmptyBlockCommentLine = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeMultipleEmptyBlockCommentLine,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.HIGH
            }
        };
    };

    public insertEmptyBlockCommentLineOnEnd = (): LineType.LineEditDefintion | undefined => {
        return config.of.addExtraLineAtEndOnBlockComment ? {
            func: this.#lineHandler.insertEmptyBlockCommentLineOnEnd,
            type: LineType.LineEditType.APPEND,
            block: {
                priority: LineType.LineEditBlockPriority.LOW
            }
        } : undefined;
    };

    public blockCommentWordCountJustifyAlign = (): LineType.LineEditDefintion | undefined => {
        return config.of.blockCommentWordCountJustifyAlign ? {
            func: this.#lineHandler.blockCommentWordCountJustifyAlign,
            type: LineType.LineEditType.REPLACE,
            block: {
                priority: LineType.LineEditBlockPriority.HIGH
            }
        } : undefined;
    };

    public genericFixBlockCommentLine = (): LineType.LineEditDefintion | undefined => {
        return {
            func: this.#lineHandler.genericFixBlockCommentLine,
            type: LineType.LineEditType.REPLACE | LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.HIGH
            }
        };
    };

    public removeEmptyLinesBetweenBlockCommantAndCode = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.removeEmptyLinesBetweenBlockCommantAndCode,
            type: LineType.LineEditType.DELETE,
            block: {
                priority: LineType.LineEditBlockPriority.HIGH
            }
        };
    };

    public printNowDateTimeOnSelection = (): LineType.LineEditDefintion => {
        return {
            func: this.#lineHandler.setNowDateTimeOnLine,
            type: LineType.LineEditType.APPEND,
        };
    };
}