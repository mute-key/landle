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
    BaseLength: number,
    ToleanceLength: number,
}

class Config {
    #currentConfig: configType;

    constructor() {
        this.#currentConfig = this.#readConfiguration();
    }

    #readConfiguration(): configType {
        const configuration = vscode.workspace.getConfiguration(packageInfo.name);
        return {
            editAsync: configuration.get<boolean>('editAsync', false),
            autoSaveAfterEdit: configuration.get<boolean>('autoSaveAfterEdit', true),
            autoTriggerOnSave: configuration.get<string>('autoTriggerOnSave', 'disabled'),
            addExtraLineAtEndOnBlockComment: configuration.get<boolean>('addExtraLineAtEndOnBlockComment', false),
            deleteCommentAlsoDeleteBlockComment: configuration.get<boolean>('deleteCommentAlsoDeleteBlockComment', false),
            blockCommentWordCountJustifyAlign: configuration.get<boolean>('blockCommentWordCountJustifyAlign', true),
            BaseLength: configuration.get<number>('blockCommentCharacterBoundaryBaseLength', 70),
            ToleanceLength: configuration.get<number>('blockCommentCharacterBoundaryTolanceLength', 5),
        };
    }

    public get of(): configType {
        return { ...this.#currentConfig };
    }

    public updateConfig = () => {
        this.#currentConfig = this.#readConfiguration(); // re-read the configuration when needed
    };
}

const config = new Config();

export {
    config
};