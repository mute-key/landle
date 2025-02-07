/**
 * this class handles the editor itself and selections.
 * 
 */
import * as vscode from 'vscode';
import { config } from "../common/config";
import { LineType } from './Handler/Line';
import { LineHandler } from './Handler/LineHandler';
import { EditorCommandParameterType } from './EditorCommand';
import { eventInstance, EventKind } from '../editor/Event';

type CursorRepositionType = {
    moveUp: number,
    moveDown: number
}

export class ActiveEditor {
    // unused. for future reference.
    #editorText: string;
    #editor: vscode.TextEditor;
    #lineHandler: InstanceType<typeof LineHandler>;
    #cursorLine: number;
    #cursorPosition: number;
    #cursorReposition: CursorRepositionType;
    #cursorSelection: vscode.Selection;

    constructor() {
        this.#documentSnapshot();
    }

    /**
     * get current active text editor
     * 
     * @returns
     * 
     */
    #setActiveEditor = (): void => {

        const activeEditor = vscode.window.activeTextEditor;
        
        if (activeEditor) {
            this.#editor = activeEditor;
            this.#lineHandler.setCurrentDocument(this.#editor);
            this.#cursorSelection = this.#editor.selections[this.#editor.selections.length - 1];
            this.#cursorLine = this.#cursorSelection.end.line;
            this.#cursorPosition = this.#cursorSelection.end.character;
            this.#cursorReposition = { moveDown: 0, moveUp: 0 };
        }
    };

    /**
     * reset cursor position as well as the selection.
     * 
     */
    #selectionReset = (): void => {

        let resetLine : number = 0;

        if (this.#cursorReposition.moveUp !== 0 || this.#cursorReposition.moveDown !== 0) {
            resetLine = this.#cursorLine + this.#cursorReposition.moveUp - this.#cursorReposition.moveDown;
            this.#cursorReposition = { moveDown: 0, moveUp: 0 };
        } else {
            resetLine = this.#cursorSelection.end.line;
        }

        this.#editor.selection = new vscode.Selection(
            new vscode.Position(resetLine, this.#cursorPosition),
            new vscode.Position(resetLine, this.#cursorPosition)
        );
    };

    #cursorControl = (range: vscode.Range): void => {

        const rangeLineCount: number = range.end.line - range.start.line;
        const isDeleteSingleLine: boolean = (rangeLineCount === 1) && range.isSingleLine;
        const startLine: number = range.start.line;
        const endLine: number = range.end.line;
        const isCursorInRange: boolean = (this.#cursorLine >= startLine && this.#cursorLine <= endLine);

        if (!isDeleteSingleLine) {
            if (isCursorInRange) {
                this.#cursorLine = startLine;
            } else {
                if (this.#cursorLine >= endLine) {
                    this.#cursorReposition.moveDown += rangeLineCount;
                }
            }
        } else {
            if (this.#cursorLine >= endLine) {
                this.#cursorReposition.moveDown++;
            }
        }
    };

    /**
     * function that store current document if no arugment is supplied.
     * if arguement supplied in function call; it compares last cached
     * document with argument and comparing if the document has been modified.
     * @param editorText
     * @returns boolean
     * - true when no argument supplied indicate the editor has been cached.
     * - true when argument supplied indicate document has not been modified.
     * - false when arguement supplied indiciate document has been modified.
     * 
     */
    #documentSnapshot = (editorText: string | undefined = undefined): boolean => {
        if (editorText === undefined) {
            if (editorText !== this.#editorText) {
                this.#editorText = this.#editor.document.getText();
            }
            return true;
        } else {
            return editorText === this.#editorText;
        }
    };

    /**
     * this function will perform edit with it's given range with string.
     * 
     * @param edit :LineType.LineEditType will have the; range, type, string
     * @param editBuilder as it's type.
     * 
     */
    #editSwitch = (edit: LineType.LineEditInfo, editBuilder: vscode.TextEditorEdit): void => {
        if (edit.type) {
            if (edit.type & LineType.LineEditType.DELETE) {
                if (!edit.range.isSingleLine) {
                    this.#cursorControl(edit.range);
                }
                editBuilder.delete(edit.range);
            }
            if (edit.type & LineType.LineEditType.CLEAR) {
                editBuilder.delete(this.#lineHandler.lineFullRange(edit.range));
            }
            if (edit.type & LineType.LineEditType.APPEND) {
                editBuilder.insert(edit.range.start, edit.string ?? '');
            }
            if (edit.type & LineType.LineEditType.REPLACE) {
                editBuilder.replace(edit.range, edit.string ?? '');
            }
            if (edit.type & LineType.LineEditType.PREPEND) {

            }
        };
    };

    // =============================================================================
    // > PUBLIC FUNCTIONS:
    // =============================================================================

    public setCurrentEditor = (editor) => {
        this.#editor = editor;
    };

    /**
     * returns object literal of class linHandler with it's method.
     * @return private instance of lineHandler
     * 
     */
    public setLineHandler = (lineHandler: LineHandler): void => {
        this.#lineHandler = lineHandler;
    };

    /**
     * it picks up current editor then, will iterate for each selection
     * range in the curernt open editor, and stack the callback function
     * references. each selection could be either; empty or singleline
     * or multiple lines but they will be handled in the Line class.
     * 
     * it could have not started to ieterate if the selection is not a
     * multiple line, however then it more conditions need to be checked
     * in this class function. beside, if choose not to iterate, means,
     * will not use array, the arugment and it's type will not be an array
     * or either explicitly use array with a single entry. that will end
     * up line handling to either recieve array or an single callback object
     * which is inconsistance. plus, it is better to handle at one execution
     * point and that would be not here.
     * 
     * @param callback line edit function and there could be more than one edit required.
     * @param includeCursorLine unused. for future reference.
     * 
     */
    public prepareEdit = (callback: LineType.LineEditDefintion[], commandOption: EditorCommandParameterType): void => {

        this.#setActiveEditor();

        if (commandOption.editAsync) {

        } else {
            const editSchedule: LineType.LineEditInfo[] = [];

            if (commandOption.includeEveryLine) {
                const range = new vscode.Selection(
                    new vscode.Position(0, 0),
                    new vscode.Position(this.#editor.document.lineCount - 1, 0)
                );
                editSchedule.push(...this.#lineHandler.prepareLines(range, callback));
            } else {
                const selections = this.#editor.selections;
                selections.forEach((range: vscode.Range) => {
                    editSchedule.push(...this.#lineHandler.prepareLines(range, callback));
                });
            }

            if (editSchedule.length > 0) {
                this.editInRange(editSchedule).catch(err => {
                    console.error('Edit Failed:', err);
                }).finally(() => {
                    this.#selectionReset();
                });
            } else {
                this.#selectionReset();
                console.log('No edit found.');
            }
        }
    };

    /**
     * performes aysnc edit and aplit it all at once they are complete.
     * 
     * @param lineCallback collecion of edits for the document how and where to edit.
     * @returns Promise<void>
     * 
     */
    public editInRange = async (lineCallback: LineType.LineEditInfo[]): Promise<void> => {
        try {
            const success = await this.#editor.edit((editBuilder: vscode.TextEditorEdit) => {
                lineCallback.forEach((edit: LineType.LineEditInfo) => this.#editSwitch(edit, editBuilder));
            });

            if (!success) {
                throw new Error('Failed to apply edit.');
            }

            this.#documentSnapshot();
            console.log('Edit applied successfully!');

            if (config.of.autoSaveAfterEdit) {
                eventInstance.emit(EventKind.AUTO_TRIGGER_ON_SAVE_SWITCH, false);
                eventInstance.saveActiveEditor(this.#editor);
            }
            if (!this.#documentSnapshot(vscode.window.activeTextEditor?.document.getText())) {
                console.log('Duplicate edit entry');
            }
        } catch (err) {
            console.error('Error applying edit:', err);
            return Promise.reject(err);
        }
    };
}