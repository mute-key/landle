/**
 * this class handles the editor itself and selections.
 * 
 */
import * as vscode from 'vscode';
import { config } from "../common/config";
import { Line } from './Function/Line';
import { LineHandler } from './Handler/LineHandler';
import { eventInstance, EventKind } from '../editor/Event';
import { BaseHandler } from "./Handler/BaseHandler";
import { CommandType } from '../type/CommandType.d';
import { LineType } from "../type/LineType.d";
import { ActiveEditorType } from "../type/ActiveEditorType";

export class ActiveEditor {
    // unused. for future reference.
    #editorText: string;
    #editor: vscode.TextEditor;
    // #lineHandler: InstanceType<typeof LineHandler>;
    #cursorLine: number;
    #cursorPosition: number;
    #cursorReposition: ActiveEditorType.CursorRepositionType;
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
            this.#cursorSelection = this.#editor.selections[this.#editor.selections.length - 1];
            this.#cursorLine = this.#cursorSelection.end.line;
            this.#cursorPosition = this.#cursorSelection.end.character;
            this.#cursorReposition = { moveDown: 0, moveUp: 0 };
            BaseHandler.loadEditor();
            Line.setCurrentEditor(activeEditor);
        }
    };

    /**
     * reset cursor position as well as the selection.
     * 
     */
    #selectionReset = (): void => {

        let resetLine: number = 0;

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
                // if (edit.string) {
                // if (this.#checkIfRangeTextIsEqual(edit.range, edit.string)) {
                // return;
                // } else {
                // editBuilder.delete(edit.range);
                // }
                // } else {
                // editBuilder.delete(edit.range);
                // }
                editBuilder.delete(edit.range);
            }
            if (edit.type & LineType.LineEditType.CLEAR) {
                editBuilder.delete(Line.lineFullRange(edit.range));
            }
            if (edit.type & LineType.LineEditType.APPEND) {
                console.log(edit);
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
        // this.#lineHandler = lineHandler;
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
    public prepareEdit = (callback: LineType.LineEditDefintion[], commandOption: CommandType.EditorCommandParameterType): void => {

        this.#setActiveEditor();

        if (commandOption.editAsync) {

        } else {
            const editSchedule: LineType.LineEditInfo[] = [];

            if (commandOption.includeEveryLine) {
                const range = new vscode.Selection(
                    new vscode.Position(0, 0),
                    new vscode.Position(this.#editor.document.lineCount - 1, 0)
                );
                editSchedule.push(...this.prepareLines(range, callback));
            } else {
                const selections = this.#editor.selections;
                selections.forEach((range: vscode.Range) => {
                    editSchedule.push(...this.prepareLines(range, callback));
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
     * this private function is a wrap and shape the return object for
     * each callback for a line. the function will take current range with
     * callback and execute to get the information how to edit the line,
     * which described in object with type of LineEditInfo. this is where
     * the default blocking value will be set to block additional edit
     * on line; default for blocking the edit is true, and it is false
     * if it is not defined in callback object.
     *
     * this means that only a function with block:true will be executed
     * and every other callbacks will be drop for the further.
     *
     * @param currntRange
     * @param fn
     * @param _lineEdit_
     * @returns LineType.LineEditInfo | undefined
     *
     */
    #editedLineInfo = (currntRange: vscode.Range, fn: LineType.LineEditDefintion): LineType.LineEditInfo | undefined => {
        const editInfo: LineType.LineEditInfo | undefined = fn.func(currntRange);
        if (editInfo) {
            // edit type override if required.
            if (fn.block || editInfo.block) {
                return <LineType.LineEditInfo>{
                    name: editInfo.name,
                    range: editInfo.range,
                    string: editInfo?.string,
                    type: editInfo.type ? editInfo.type : fn.type,
                    block: {
                        priority: editInfo.block?.priority ? editInfo.block?.priority : fn.block?.priority,
                        lineSkip: editInfo.block?.lineSkip
                    }
                };
            } else {
                return <LineType.LineEditInfo>{
                    ...editInfo,
                    type: editInfo.type ? editInfo.type : fn.type,
                };
            }
        }
    };

    /**
     * this is the mian loop to iterate the callbacks that are defined
     * from command class. there is a object key named block. when the
     * property block is true, it will drop all the added edit, and assign
     * itself and stops further iteration to prevent no more changes to
     * be applied to when the for loop is finished, it will be stacked
     * into _line_edit_
     *
     * this iteration could well have been done in array.reduce but it
     * does unnecessary exection in the iteartion. so thats why it is for
     * loop.
     *
     * @param range
     * @param callback
     * @returns LineType.LineEditInfo[]
     * 
     */
    #handleLineEdit = (range: vscode.Range, callback: LineType.LineEditDefintion[]): LineType.LineEditInfo[] => {
        let currentLineEdit: LineType.LineEditInfo[] = [];
        let priority = LineType.LineEditBlockPriority.UNSET;
        let blockFlag: boolean = false;
        for (const fn of callback) {
            const result: LineType.LineEditInfo | undefined = this.#editedLineInfo(range, fn);
            if (result) {
                if (result.block) {
                    if (result.block.priority > priority) {
                        currentLineEdit = [result];
                        priority = result.block.priority;
                        blockFlag = true;
                    }
                } else if (!blockFlag) {
                    currentLineEdit.push(result);
                }
            }
        }
        return currentLineEdit;
    };
    /**
     * this funciton will iterate each line and stack the line edit object.
     * iteration will continue unitl the current line number is less than
     * less than line number of the each selection. the range at this point
     * of will represent a single range and not entire document. callback
     * will be a list of callbacks to check/apply to each line. _lineEdit_
     * variable are being used as a references so no direct assignement
     * becuase the is what this function will return upon the end of the
     * iteration.
     *
     * there is a for loop that will iterate each every callback. the problem
     * with js array api is it lacks handling the undefined value being
     * in api functions rather, you have to chain them. using array api
     * in object (becuase it is what it needs to iterate on), the type
     * mismatch forces to return either a typed object or undefined becasuse
     * the will have a return type. this means the reseult of the iteration
     * will contain undefiend item if callback returns undefined and it
     * 
     * makes to iterate twice to filter them for each every line. further
     * 
     * explanation continues
     *
     * @param range
     * @param callback
     * @param currentLineNumber
     * @param _lineEdit_
     * @returns IterateLineType[]
     *
     */
    #lineIteration = (range: vscode.Range, callback: LineType.LineEditDefintion[], currentLineNumber: number, _lineEdit_: LineType.LineEditInfo[], lineSkip?: Set<number>): LineType.LineEditInfo[] => {
        lineSkip = lineSkip ?? new Set();

        while (currentLineNumber <= range.end.line) {
            if (lineSkip.has(currentLineNumber)) {
                currentLineNumber++;
                continue;
            }

            const currentLineEdit = this.#handleLineEdit(Line.lineFullRange(currentLineNumber), callback);
            if (currentLineEdit.length > 0) {
                if (currentLineEdit[0].block) {
                    if (currentLineEdit[0].block.lineSkip) {
                        currentLineEdit[0].block.lineSkip.forEach(line => lineSkip.add(line));
                    }
                }
                _lineEdit_.push(...currentLineEdit);
            }
            currentLineNumber++;
        }
        return _lineEdit_;

    };
    /**
     * take range as a single selection that could be a single line, empty
     * (cursor only) or mulitple lines. the callback will be defined in
     * Command.ts. this function will return either a single LineEditInfo
     * or array of them to schedule the document edit. if the selection
     * is either of empty (whitespaces only) or a single line, the range
     * should be the whole line.
     *
     * @param range
     * @param callback
     * @returns
     *
     */
    public prepareLines = (range: vscode.Range, callback: LineType.LineEditDefintion[]): LineType.LineEditInfo[] => {
        const targetLine = range.start.line;

        // on each selection, starting line is: isEmpty or if selection is singleLine
        if (range.isEmpty || range.isSingleLine) {
            return this.#handleLineEdit(Line.lineFullRange(targetLine), callback);
        }

        return this.#lineIteration(
            range,
            callback,
            targetLine,
            <LineType.LineEditInfo[]>[]);
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