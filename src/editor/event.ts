import * as vscode from "vscode";
import { EventEmitter } from 'events';
import packageInfo from '../../package.json' assert { type: 'json' };
import config from "../common/config";

class Event extends EventEmitter {
    #directCall: boolean = false;

    public isDirectCall = () => {
        this.#directCall = true;
    };

    public isNotDirectCall = () => {
        this.#directCall = false;
    };

    // public AutoSaveEvent = () => {
    //     this.on('autoTriggerOnSaveEvent', (directCallStatus: boolean) => {
    //         this.#directCall = directCallStatus;
    //     });
    // };

    public autoTriggerOnSaveEvent = (): vscode.Disposable => {
        // this.emit('autoTriggerOnSaveEvent', this.#directCall);
        return vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
            if (config.autoTriggerOnSave !== "disabled" && this.#directCall) {
                vscode.commands.executeCommand(packageInfo.name + "." + config.autoTriggerOnSave, { includeEveryLine: true });
            }
        });
    };

    public autoTriggerOnSaveResetEvent = (): vscode.Disposable => {
        return vscode.workspace.onDidSaveTextDocument((event: vscode.TextDocument) => {
            this.isDirectCall();
        });
    };
}

export const event = new Event();