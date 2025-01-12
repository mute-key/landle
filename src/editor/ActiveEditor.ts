/**
 * this class handles the editor itself and selections. 
 */

import * as vscode from "vscode";

import {
    LineEditType,
    LineEditDefintion,
    LineEditInfo,
    Line,
    IterateLineType
} from "./Line";

export class ActiveEditor extends Line {
    
    // unused. for future reference.
    #documentSnapshot: string | undefined; 
    #editor: vscode.TextEditor | undefined;

    constructor() {
        super();        
    }

    #getActiveEditor = () => {
        this.#editor = vscode.window.activeTextEditor;
        if (this.#editor) {
            this.#documentSnapshot = this.#editor.document.getText();
        } else {
            return;
        }
    };

    /**
     * this function will perform edit with it's given range with string. 
     * 
     * @param edit :LineEditType will have the;
     * - range
     * - type 
     * - string
     * @param editBuilder as it's type. 
     */
    #editSwitch = (edit: LineEditInfo, editBuilder : vscode.TextEditorEdit) : void => {
        if (edit) {
            switch (edit.type) {
                case LineEditType.APPEND:
                    editBuilder.insert(edit.range.start, edit.string ?? "");
                    break;
                case LineEditType.CLEAR:
                    editBuilder.delete(this.lineFullRange(edit.range));
                    break;
                case LineEditType.DELETE:
                    editBuilder.delete(edit.range);
                    break;
                case LineEditType.REPLACE:
                    editBuilder.replace(edit.range, edit.string ?? "");
                    break;
                case LineEditType.PREPEND:
                    break;
                default:
            }
        };
    };
    
    // =============================================================================
    // > RPOTECED FUNCTIONS: 
    // =============================================================================

    protected snapshotDocument = () => {
        this.#documentSnapshot = vscode.window.activeTextEditor?.document.getText();
    };

    // protected addEmptyLine = () => {
    //     if (this.#editor?.document.lineCount)
    // };

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    /**
     * it picks up current editor then, will iterate for each selection range in the 
     * curernt open editor, and stack the callback function references. 
     * each selection could be either; empty or singleline or multiple lines but 
     * they will be handled in the Line class. 
     * 
     * it could have not started to ieterate if the selection is not a multiple line,
     * however then it more conditions need to be checked in this class function. 
     * beside, if choose not to iterate, means, will not use array, the arugment and
     * it's type will not be an array or either explicitly use array with a single entry.
     * that will end up line handling to either recieve array or an single callback 
     * object which is inconsistance. plus, it is better to handle at one execution point 
     * and that would be not here. 
     * 
     * @param callback line edit function and there could be more than one edit required.
     * @param includeCursorLine unused. for future reference. 
     */
    public prepareEdit = (callback: LineEditDefintion[], includeCursorLine: boolean): void => {
        this.#getActiveEditor();
        const editSchedule: IterateLineType[] = [];
        const selections = this.#editor?.selections;

        selections?.forEach((range : vscode.Range) => {
            editSchedule.push(...this.prepareLines(range, callback));
        });

        this.editInRange(editSchedule);
    };

    /**
     * performes aysnc edit and aplit it all at once they are complete. 
     * 
     * @param lineCallback collecion of edits for the document how and where to edit. 
     */
    public editInRange = async (lineCallback: any[]) : Promise<void> => {
        try {
            const success = await this.#editor?.edit((editBuilder: vscode.TextEditorEdit) => {
                lineCallback.forEach((edit: LineEditInfo) => this.#editSwitch(edit ,editBuilder));
            }).then();

            if (success) {
                console.log('Edit applied successfully!');
            } else {
                console.log('Failed to apply edit.');
            }
        } catch (err) {
            console.log('Error applying edit:', err);
        }
    };
}
