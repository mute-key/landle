/**
 * this class handles the editor itself and selections. 
 * 
 */
import * as vscode from 'vscode';
import config from "../common/config";
import { LineType } from './Line';
import { LineHandler } from './LineHandler';
import { EditorCommandParameterType } from './EditorCommand';
import { event } from '../editor/event';

export class ActiveEditor {
    
    // unused. for future reference.
    #editorText: string | undefined;
    #editor: vscode.TextEditor | undefined;
    #lineHandler : InstanceType<typeof LineHandler>;

    constructor() {
        this.#editor = vscode.window.activeTextEditor;
        this.#documentSnapshot();
    }

    /**
     * get current active text editor 
     * @returns
     * 
     */
    #setActiveEditor = () : void => {
        this.#editor = vscode.window.activeTextEditor;
        this.#lineHandler.setCurrentDocument();
        if (!this.#editor) {
            return;
        }
    };

    #autoSaveAfterEdit = () : void => {
        if (this.#editor) {
            this.#editor.document.save();
        }
    };

    /**
     * reset cursor position as well as the selection. 
     * 
     */
    #selectionReset = () : void => {
        if (this.#editor) {
            const range : vscode.Range = this.#editor.selections[0];
            this.#editor.selection = new vscode.Selection(
                new vscode.Position(range.start.line, 0),
                new vscode.Position(range.start.line, 0)
            );
        }
    };

    /**
     * Originally, this function used vscode.Selection to select entire 
     * document but the issue is that creating new selection flashes on 
     * when the function is triggered. instead, this function will go 
     * through every line in the document instead. 
     * 
     */
    #selectionEntireDocument = () : vscode.Range | undefined => {
        if (this.#editor) {
            return new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(this.#editor.document.lineCount-1, 0)
            );
        }
        return;
    };


    /**
     * function that store current document if no arugment is supplied.
     * if arguement supplied in function call; it compares last cached
     * document with argument and comparing if the document has been modified. 
     * 
     * 
     * @param editorText
     * @returns boolean
     * - true when no argument supplied indicate the editor has been cached. 
     * - true when argument supplied indicate document has not been modified. 
     * - false when arguement supplied indiciate document has been modified. 
     * 
     * 
     */
    #documentSnapshot = (editorText: string | undefined = undefined): boolean => {
        if (this.#editor) {
            if (editorText === undefined) {
                if (editorText !== this.#editorText) {
                    this.#editorText = this.#editor.document.getText();
                }
                return true;
            } else {
                return editorText === this.#editorText;
            }
        }
        return false;
    };

    /**
     * this function will perform edit with it's given range with string.
     * 
     * @param edit :LineType.LineEditType will have the;
     * - range - type - string 
     * @param editBuilder as it's type.
     * 
     */
    #editSwitch = (edit: LineType.LineEditInfo, editBuilder : vscode.TextEditorEdit) : void => {
        if (edit.type) {
            if (edit.type & LineType.LineEditType.DELETE) {
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

    /**
     * returns object literal of class linHandler with it's method. 
     * @return private instance of lineHandler
     * 
     */
    public setLineHandler = (lineHandler: LineHandler) : void => {
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
        const editSchedule: LineType.LineEditInfo[] = [];
        if (this.#editor) {
            if (commandOption.includeEveryLine) {
                editSchedule.push(...this.#lineHandler.prepareLines(<vscode.Range>this.#selectionEntireDocument(), callback));
            } else {
                const selections = this.#editor.selections;
                selections.forEach((range : vscode.Range) => {
                    editSchedule.push(...this.#lineHandler.prepareLines(range, callback));
                });
            }    
            this.editInRange(editSchedule);
        }
    };

    /**
     * performes aysnc edit and aplit it all at once they are complete.
     * 
     * @param lineCallback collecion of edits for the document how and where to edit.
     * 
     */
    public editInRange = async (lineCallback: LineType.LineEditInfo[]) : Promise<void> => {
        try {
            if (!this.#documentSnapshot(vscode.window.activeTextEditor?.document.getText())) {
                const success = await this.#editor?.edit((editBuilder: vscode.TextEditorEdit) => {
                    lineCallback.forEach((edit: LineType.LineEditInfo) => this.#editSwitch(edit ,editBuilder));
                });
    
                if (success) {
                    this.#selectionReset();
                    this.#documentSnapshot();
                    console.log('Edit applied successfully!');
                    if (config.autoSaveAfterEdit) {
                        event.isNotDirectCall();
                        this.#editor?.document.save();
                    }
                } else {
                    console.log('Failed to apply edit.');
                }
            } else {
                console.log('Duplicate edit entry');
            }
        } catch (err) {
            console.log('Error applying edit:', err);
        }
    };
}
