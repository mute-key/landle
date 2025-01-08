import * as vscode from "vscode";




// import { LineSelection } from "./LineSelection";
import { 
    LineEditType, 
    LineEditCallback, 
    LineEditInfo, 
    Line, 
    IterateLineType
} from "./Line";



export class ActiveEditor {
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

    // protected currentSelection = (() : vscode.Selection[] => <vscode.Selection[]>vscode.window.activeTextEditor?.selections)();

    private validateChange = (newDocumentText) => this.#documentSnapshot === newDocumentText;

    protected snapshotDocument = () => {
        this.#documentSnapshot = vscode.window.activeTextEditor?.document.getText();
    };

    // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {

    // };

    
    /**
     * 
     * @param callback 
     */
    public prepareEdit = (callback: LineEditCallback | LineEditCallback[], includeCursorLine : boolean) => {
        
        let selections = this.#editor?.selections;
        const editSchedule : IterateLineType[] = [];

        if (selections?.length === 1) {
            // only 1 selection or cursor on line
            const nl : IterateLineType[] = this.line.prepareLines(this.#editor, selections[0], callback);
            editSchedule.push(...nl);
            this.editInRange(editSchedule);
        } else {
            // multiple selection
            selections?.forEach((range) => {
                // const nl : IterateLineType[] = ;
                editSchedule.push(...this.line.prepareLines(this.#editor, range, callback));
            });
            console.log(editSchedule)
            this.editInRange(editSchedule);
        }
    };

    public editInRange = async (lineCallback : any[]) => {
        try {
            const success = await this.#editor?.edit((editBuilder : vscode.TextEditorEdit) => {
                lineCallback.forEach((edit: LineEditInfo) => {
                    if (edit !== undefined) {
                        switch (edit.type) {
                            case LineEditType.APPEND:
                                break;
                            case LineEditType.PREPEND:
                                break;
                            case LineEditType.REPLACE:
                                editBuilder.replace(edit.range, edit.string ?? "????");
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
                // this.snapshotDocument();
            } else {
                console.log('Failed to apply edit.');
            }
        } catch (err) {
            console.log('Error applying edit:', err);
        }
    };

    // public applyEdit = async () => {
    //     return this.editor?.edit((editBuilder) => {
    //         // editBuilder.
    //         // this.#edit = editBuilder;
    //         // this.interateSelections(callback);
    //     });
    // };
}
