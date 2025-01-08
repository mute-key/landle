import * as vscode from "vscode";

import { 
    LineEditType, 
    LineEditCallback, 
    LineEditInfo, 
    Line, 
    IterateLineType
} from "./Line";

export class ActiveEditor{
    
    #documentSnapshot: string | undefined;
    #editor: vscode.TextEditor | undefined;

    protected line : Line;

    constructor() {
        this.line = new Line();
        this.#editor = vscode.window.activeTextEditor;
        if (this.#editor) {
            this.#documentSnapshot = this.#editor.document.getText();
        } else {
            // error
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
    
    public prepareEdit = (callback: LineEditCallback | LineEditCallback[], includeCursorLine : boolean) : void => {

        const editSchedule : IterateLineType[] = [];
        let selections = this.#editor?.selections;

        if (selections?.length === 1) {
            // single selection area or cursor on line
            editSchedule.push(...this.line.prepareLines(this.#editor, selections[0], callback));
        } else {
            // multiple selections
            selections?.forEach((range) => {
                editSchedule.push(...this.line.prepareLines(this.#editor, range, callback));
            });
        }
        this.editInRange(editSchedule);
    };

    public editInRange = async (lineCallback : any[]) => {
        try {
            const success = await this.#editor?.edit((editBuilder : vscode.TextEditorEdit) => {
                lineCallback.forEach((edit: LineEditInfo) => {
                    if (edit !== undefined) {
                        switch (edit.type) {
                            case LineEditType.APPEND:
                                editBuilder.insert(edit.range.start, edit.string ?? "");
                                break;
                            case LineEditType.PREPEND:
                                break;
                            case LineEditType.REPLACE:
                                editBuilder.replace(edit.range, edit.string ?? "");
                                break;
                            case LineEditType.CLEAR:
                                break;
                            case LineEditType.DELETE:
                                editBuilder.delete(edit.range);
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
