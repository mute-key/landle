import * as vscode from 'vscode';
import packageInfo from '../../package.json' assert { type: 'json' };

const configuration = vscode.workspace.getConfiguration(packageInfo.name);

const config = {
    addExtraLineAtEndOnBlockComment: configuration.get<boolean>('addExtraLineAtEndOnBlockComment', true),
    deleteCommentAlsoDeleteBlockComment: configuration.get<boolean>('deleteCommentAlsoDeleteBlockComment', true),
    blockCommentWordCountAutoLengthAlign: configuration.get<boolean>('blockCommentWordCountAutoLengthAlign', true),
    autoTriggerOnSave: configuration.get<string>('blockCommentWordCountAutoLengthAlign', 'cleanUpDocumentCommand'),
    autoSaveAfterEdit: configuration.get<boolean>('autoSaveAfterEdit', true),
    BaseLength: configuration.get<number>('blockCommentCharacterBoundaryBaseLength', 70),
    ToleanceLength: configuration.get<number>('blockCommentCharacterBoundaryTolanceLength', 5),
};

export default config;
