import * as vscode from 'vscode';
import packageInfo from '../../package.json' assert { type: 'json' };

type configType = {
    editAsync: boolean,
    addExtraLineAtEndOnBlockComment: boolean,
    deleteCommentAlsoDeleteBlockComment: boolean,
    blockCommentWordCountAutoLengthAlign: boolean,
    autoTriggerOnSave: string,
    autoSaveAfterEdit: boolean,
    BaseLength: number,
    ToleanceLength: number
}

class Config {
    #currentConfig: configType;

    constructor() {
        this.#currentConfig = this.#readConfiguration();
    }

    #readConfiguration(): configType {
        const configuration = vscode.workspace.getConfiguration(packageInfo.name);
        return {
            editAsync: configuration.get<boolean>('editAsync', true),
            addExtraLineAtEndOnBlockComment: configuration.get<boolean>('addExtraLineAtEndOnBlockComment', true),
            deleteCommentAlsoDeleteBlockComment: configuration.get<boolean>('deleteCommentAlsoDeleteBlockComment', true),
            blockCommentWordCountAutoLengthAlign: configuration.get<boolean>('blockCommentWordCountAutoLengthAlign', true),
            autoTriggerOnSave: configuration.get<string>('blockCommentWordCountAutoLengthAlign', 'cleanUpDocumentCommand'),
            autoSaveAfterEdit: configuration.get<boolean>('autoSaveAfterEdit', true),
            BaseLength: configuration.get<number>('blockCommentCharacterBoundaryBaseLength', 70),
            ToleanceLength: configuration.get<number>('blockCommentCharacterBoundaryTolanceLength', 5),
        };
    }

    public get of(): configType {
        return { ...this.#currentConfig };
    }

    public updateConfig = () => {
        this.#currentConfig = this.#readConfiguration();  // re-read the configuration when needed
    };
}

const config = new Config();

export {
    config
};