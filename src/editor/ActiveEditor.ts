import * as vscode from "vscode";

import {
    LineEditType,
    LineEditDefintion,
    LineEditInfo,
    Line,
    IterateLineType
} from "./Line";

export class ActiveEditor {

    #documentSnapshot: string | undefined;
    #editor: vscode.TextEditor | undefined;

    protected line: Line;

    constructor() {
        this.line = new Line();
        this.#editor = vscode.window.activeTextEditor;
        if (this.#editor) {
            this.#documentSnapshot = this.#editor.document.getText();
        } else {
            return;
        }
    }
    // =============================================================================
    // > RPOTECED FUNCTIONS: 
    // =============================================================================

    protected snapshotDocument = () => {
        this.#documentSnapshot = vscode.window.activeTextEditor?.document.getText();
    };

    // =============================================================================
    // > PUBLIC FUNCTIONS: 
    // =============================================================================

    public prepareEdit = (callback: LineEditDefintion[], includeCursorLine: boolean): void => {

        const editSchedule: IterateLineType[] = [];
        const selections = this.#editor?.selections;

        selections?.forEach((range : vscode.Range) => {
            editSchedule.push(...this.line.prepareLines(range, callback));
        });

        this.editInRange(editSchedule);
    };

    public editInRange = async (lineCallback: any[]) => {
        try {
            const success = await this.#editor?.edit((editBuilder: vscode.TextEditorEdit) => {
                lineCallback.forEach((edit: LineEditInfo) => {
                    if (edit) {
                        switch (edit.type) {
                            case LineEditType.APPEND:
                                editBuilder.insert(edit.range.start, edit.string ?? "");
                                break;
                            case LineEditType.CLEAR:
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
                    }
                });
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
