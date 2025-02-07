import * as vscode from "vscode";
import packageInfo from '../../package.json' assert { type: 'json' };
import { EventEmitter } from 'events';
import { config } from "../common/config";

enum EventKind {
    AUTO_TRIGGER_ON_SAVE_SWITCH = 'AUTO_TRIGGER_ON_SAVE_SWITCH',
}

/**
 * EventEmitter is maybe an overkill but to make it expendable in future.
 * thus, this will be a good template to work on for async events in future.
 * <-- here is bug
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

    public saveActiveEditor = async (editor): Promise<boolean> => {
        return await editor.document.save();
    };

    public checkKeybindCollision = () => {
        // const os = vscode.env.os;
        // console.log('process.env', process.env);
        // const os = process.platform;
        // console.log('Current OS:', os);
        // WSL_DISTRO_NAME
    };

    public onDidChangeActiveTextEditor = (editorCommandGroup: vscode.Disposable[]): vscode.Disposable => {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                editorCommandGroup;
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