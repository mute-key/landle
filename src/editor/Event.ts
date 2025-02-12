import * as vscode from "vscode";
import packageInfo from '../../package.json' assert { type: 'json' };
import { EventEmitter } from 'events';
import { config } from "../common/config";
import { BaseHandler } from "./Handler/BaseHandler";
import { LineHandler } from "./Handler/LineHandler";
import { CommentHandler } from "./Handler/CommentHandler";

enum EventKind {
    AUTO_TRIGGER_ON_SAVE_SWITCH = 'AUTO_TRIGGER_ON_SAVE_SWITCH',
    ACTIVE_EDITOR_CHANGED = 'ACTIVE_EDITOR_CHANGED',
}

/**
 * EventEmitter is maybe an overkill but to make it expendable in future.
 * thus, this will be a good template to work on for async events in future.
 * 
 */
class Event extends EventEmitter {

    #directCall: boolean = true;

    constructor() {
        super();
        this.#autoSaveEventSwitch();
    }

    #autoSaveEventSwitch = () => {
        this.on(EventKind.AUTO_TRIGGER_ON_SAVE_SWITCH, (directCallStatus: boolean) => {
            this.#directCall = directCallStatus;
        });
    };

    public pushMessage = (message: string) => {
        vscode.window.showInformationMessage(message);
    };

    public saveActiveEditor = (editor: vscode.TextEditor): void => {
        try {
            // can call formatter or linter stuff here later.
            editor.document.save().then((res) => {
                if (!res) {
                    this.pushMessage('Save on active editor failed:');
                }
            });
        } catch(err) {
            this.pushMessage('Save on active editor failed:' + err);
        }
    };

    public checkKeybindCollision = () => {
        // const os = vscode.env.os;
        // console.log('process.env', process.env);
        // const os = process.platform;
        // console.log('Current OS:', os);
        // WSL_DISTRO_NAME
    };

    public onDidChangeActiveTextEditor = (): vscode.Disposable => {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                // BaseHandler.loadEditor();
                // LineHandler.setEditor(editor);
                // CommentHandler.setEditor(editor);
            }
        });
    };

    public autoTriggerOnSaveEvent = (): vscode.Disposable => {
        return vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
            if (config.of.autoTriggerOnSave !== "disabled" && this.#directCall) {
                vscode.commands.executeCommand(packageInfo.name + "." + config.of.autoTriggerOnSave, { includeEveryLine: true });
            }
        });
    };

    public autoTriggerOnSaveResetEvent = (): vscode.Disposable => {
        return vscode.workspace.onDidSaveTextDocument((event: vscode.TextDocument) => {
            this.#directCall = true;
        });
    };

    public onDidChangeConfiguration = (): vscode.Disposable => {
        return vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
            if (event.affectsConfiguration(packageInfo.name + 'blockCommentCharacterBoundaryToleranceLength')) {
                const value = config.of.blockCommentCharacterBoundaryToleranceLength;
                if (value < 5) {
                    this.pushMessage('Block Comment Length Tolerance can not be less than 10');
                    config.update("blockCommentCharacterBoundaryToleranceLength", 10, vscode.ConfigurationTarget.Global);
                }
            }
            
            config.updateConfig();
            this.#directCall = true;
        });
    };
}

const eventInstance = new Event();

export {
    eventInstance,
    EventKind
};