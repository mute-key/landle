import * as vscode from "vscode";



import {
    removeTrailingWhiteSpaceString,
    removeMultipleWhiteSpaceString,
    findMultipleWhiteSpaceString,
    splitStringOn,
    getNowDateTimeStamp,
    pushMessage
} from "../common/util";
import { LineSelection } from "./LineSelection";
import { LineEditType } from "./Line";

export class ActiveEditor extends LineSelection {
    #documentSnapshot: string | undefined;
    #editor: vscode.TextEditor | undefined;

    constructor() {
        super();
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

    private snapshotDocument = () => {
        this.#documentSnapshot = vscode.window.activeTextEditor?.document.getText();
    };

    // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {

    // };

    public prepareEditRange = (range : vscode.Range, editType : LineEditType) => {
        // switch ()
        // EditType
        // switch (editType) {
        //     case LineEditType.APPEND:
        //         // code block
        //         break;
        //     case LineEditType.PREPEND:
        //         // code block
        //         break;
        //     case LineEditType.REPLACE:
        //         break;
        //     case LineEditType.CLEAR:
        //         break;
        //     case LineEditType.DELETE:
        //         break;
        //     default:
        //     // code block
        // }
    };


    public editInRange = async (editor: vscode.TextEditor, range: vscode.Range) => {
        // editor.edit()를 사용하여 문서 편집
        const edit = new vscode.WorkspaceEdit();
        // edit
    

        // // 1. 첫 번째 편집 작업
        // const firstEdit = new vscode.Range(range.start, range.start.translate(0, 5)); // 5개 문자 범위
        // edit.replace(editor.document.uri, firstEdit, 'Hello');

        // // 2. 두 번째 편집 작업 (위치가 바뀐 텍스트 이후로)
        // const secondEdit = new vscode.Range(range.start.translate(0, 5), range.start.translate(0, 10)); // 5개 문자 범위
        // edit.replace(editor.document.uri, secondEdit, 'World');

        // // 3. 세 번째 편집 작업 (좀 더 뒤쪽 범위)
        // const thirdEdit = new vscode.Range(range.start.translate(0, 10), range.start.translate(0, 15));
        // edit.replace(editor.document.uri, thirdEdit, 'VSCode');

        // 여러 작업을 한 번에 커밋
        await vscode.workspace.applyEdit(edit); // 이때 모든 변경이 한 번에 반영
        this.snapshotDocument();
    };

    // public applyEdit = async () => {
    //     return this.editor?.edit((editBuilder) => {
    //         // editBuilder.
    //         // this.#edit = editBuilder;
    //         // this.interateSelections(callback);
    //     });
    // };
}
