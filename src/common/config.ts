import * as vscode from 'vscode';
import packageInfo from '../../package.json' assert { type: 'json' };

const configuration = vscode.workspace.getConfiguration(packageInfo.name);

// const keybindings2 = vscode.commands.
// console.log('Keybindings:', keybindings2);

const config = {
    editAsync: configuration.get<boolean>('editAsync', true),
    addExtraLineAtEndOnBlockComment: configuration.get<boolean>('addExtraLineAtEndOnBlockComment', true),
    deleteCommentAlsoDeleteBlockComment: configuration.get<boolean>('deleteCommentAlsoDeleteBlockComment', true),
    blockCommentWordCountAutoLengthAlign: configuration.get<boolean>('blockCommentWordCountAutoLengthAlign', true),
    autoTriggerOnSave: configuration.get<string>('blockCommentWordCountAutoLengthAlign', 'cleanUpDocumentCommand'),
    autoSaveAfterEdit: configuration.get<boolean>('autoSaveAfterEdit', true),
    BaseLength: configuration.get<number>('blockCommentCharacterBoundaryBaseLength', 70),
    ToleanceLength: configuration.get<number>('blockCommentCharacterBoundaryTolanceLength', 5),
} as const;

const commandId = {};

(() => {
    for(const c of packageInfo.contributes.commands) {
        if (c.command) {
            const cArray = c.command.split('.');
            commandId[cArray[1]] = {};
        }
    }
})();

const keybindings = packageInfo.contributes.keybindings;

export {
    config,
    commandId,
    keybindings
};
