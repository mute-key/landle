import * as vscode from 'vscode';
import packageInfo from '../../package.json' assert { type: 'json' };

// "editor.insertSpaces": true
// "files.trimTrailingWhitespace": true
// "files.trimFinalNewlines": true

type configType = {
    editAsync: boolean,
    addExtraLineAtEndOnBlockComment: boolean,
    deleteCommentAlsoDeleteBlockComment: boolean,
    autoTriggerOnSave: string,
    autoSaveAfterEdit: boolean,
    blockCommentWordCountJustifyAlign: boolean
    blockCommentCharacterBoundaryBaseLength: number,
    blockCommentCharacterBoundaryToleranceLength: number,
    removeWhitespaceBeforeInlineComment: boolean,
    removeWhitespaceOflineComment: boolean
}

const currentConfig = (() => {
    return vscode.workspace.getConfiguration(packageInfo.name);
})();

class Config {
    #currentConfig: configType;
    #configuration: vscode.WorkspaceConfiguration = currentConfig;
    #configCollection: configType;

    constructor() {
        this.#readConfiguration();
    }

    #checkBlockCommentCharacterBoundaryBaseLength = () : number => {
        let blockCommentCharacterBoundaryBaseLength = this.#configuration.get<number>('blockCommentCharacterBoundaryBaseLength', 10);
        blockCommentCharacterBoundaryBaseLength = blockCommentCharacterBoundaryBaseLength >= 10 ? blockCommentCharacterBoundaryBaseLength : 10;
        this.update("blockCommentCharacterBoundaryToleranceLength", 10, vscode.ConfigurationTarget.Global);
        return blockCommentCharacterBoundaryBaseLength;
    };

    #readConfiguration(): void {
        this.#configuration = currentConfig;
        this.#configCollection = {
            editAsync: this.#configuration.get<boolean>('editAsync', false),
            autoSaveAfterEdit: this.#configuration.get<boolean>('autoSaveAfterEdit', true),
            autoTriggerOnSave: this.#configuration.get<string>('autoTriggerOnSave', 'disabled'),
            addExtraLineAtEndOnBlockComment: this.#configuration.get<boolean>('addExtraLineAtEndOnBlockComment', false),
            deleteCommentAlsoDeleteBlockComment: this.#configuration.get<boolean>('deleteCommentAlsoDeleteBlockComment', false),
            blockCommentWordCountJustifyAlign: this.#configuration.get<boolean>('blockCommentWordCountJustifyAlign', true),
            blockCommentCharacterBoundaryBaseLength: this.#checkBlockCommentCharacterBoundaryBaseLength(),
            blockCommentCharacterBoundaryToleranceLength: this.#configuration.get<number>('blockCommentCharacterBoundaryToleranceLength', 10),
            removeWhitespaceBeforeInlineComment: this.#configuration.get<boolean>('removeWhitespaceBeforeInlineComment', true),
            removeWhitespaceOflineComment: this.#configuration.get<boolean>('removeWhitespaceOflineComment', true),
        };
    }

    public get of(): configType {
        return { ...this.#configCollection };
    }

    public updateConfig = () => {
        this.#readConfiguration(); // re-read the configuration when needed
    };

    public update = (section: string, value: any, configurationTarget?: vscode.ConfigurationTarget | boolean | null) => {
        this.#configuration.update(section, value, configurationTarget);
    };
}

const config = new Config();

export {
    config
};