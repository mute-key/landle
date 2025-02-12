"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src/register.ts
var vscode9 = __toESM(require("vscode"));

// package.json
var package_default = {
  name: "landle",
  publisher: "mutekey",
  displayName: "landle",
  description: "Generic code clean up extension",
  version: "0.9.2078",
  icon: "./misc/icon2.png",
  repository: {
    type: "git",
    url: "https://github.com/mute-key/landle"
  },
  content: {
    baseContentUrl: "https://github.com/mute-key/landle/blob/master/",
    baseImagesUrl: "https://github.com/mute-key/landle/raw/master/"
  },
  engines: {
    vscode: "^1.96.0"
  },
  keywords: [
    "formatter",
    "comments",
    "empty line",
    "whitespace"
  ],
  categories: [
    "Snippets",
    "Formatters",
    "Keymaps",
    "Other"
  ],
  activationEvents: [
    "onStartupFinished",
    "onDebug"
  ],
  main: "./dist/extension.js",
  extensionKind: [
    "ui",
    "workspace"
  ],
  contributes: {
    commands: [
      {
        command: "landle.removeDocumentStartingEmptyLine",
        title: "__"
      },
      {
        command: "landle.removeTrailingWhitespaceFromSelection",
        title: "Remove Trailing Whitespace From Selection"
      },
      {
        command: "landle.removeMulitpleEmptyLinesFromSelection",
        title: "Remove Mulitple Empty Lines From Selection"
      },
      {
        command: "landle.removeMultipleWhitespaceFromSelection",
        title: "Remove Multiple Whitespace From Selection"
      },
      {
        command: "landle.removeEmptyLinesFromSelection",
        title: "Remove Empty Lines From Selection"
      },
      {
        command: "landle.removeCommentedTextFromSelection",
        title: "Remove Commented Text From Selection"
      },
      {
        command: "landle.removeDuplicateLineFromSelection",
        title: "__"
      },
      {
        command: "landle.removeEmptyBlockCommentLineOnStart",
        title: "__"
      },
      {
        command: "landle.removeMultipleEmptyBlockCommentLine",
        title: "__"
      },
      {
        command: "landle.insertEmptyBlockCommentLineOnEnd",
        title: "__"
      },
      {
        command: "landle.blockCommentWordCountJustifyAlign",
        title: "__"
      },
      {
        command: "landle.removeEmptyLinesBetweenBlockCommantAndCode",
        title: "__"
      },
      {
        command: "landle.printNowDateTimeOnSelection",
        title: "Print Now DateTime On Selection"
      },
      {
        command: "landle.cleanUpBlockCommentCommand",
        title: "clean-up Block Comment From Selection"
      },
      {
        command: "landle.cleanUpCodeCommand",
        title: "clean-up Block Comment From Selection"
      },
      {
        command: "landle.cleanUpDocumentCommand",
        title: "Clean-up Whitespace From Selection"
      },
      {
        command: "landle.cleanUpComments",
        title: "Clean-up Code From Selection"
      },
      {
        command: "landle.fixBrokenBlockComment",
        title: "Fix broken block comment format"
      }
    ],
    keybindings: [
      {
        command: "landle.removeTrailingWhitespaceFromSelection",
        key: "ctrl+alt+w",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.removeMulitpleEmptyLinesFromSelection",
        key: "ctrl+alt+m",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.removeEmptyLinesFromSelection",
        key: "ctrl+alt+e",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.removeMultipleWhitespaceFromSelection",
        key: "ctrl+alt+space",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.removeCommentedTextFromSelection",
        key: "ctrl+alt+/",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.removeDuplicateLineFromSelection",
        key: "ctrl+alt+d",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.printNowDateTimeOnSelection",
        key: "ctrl+alt+n",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.blockCommentWordCountJustifyAlign",
        key: "ctrl+alt+a",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.cleanUpBlockCommentCommand",
        key: "ctrl+alt+b",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.cleanUpDocumentCommand",
        key: "ctrl+alt+c",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.cleanUpCodeCommand",
        key: "ctrl+alt+x",
        when: "editorTextFocus || editorFocus"
      },
      {
        command: "landle.fixBrokenBlockComment",
        key: "ctrl+alt+f",
        when: "editorTextFocus || editorFocus"
      }
    ],
    configuration: {
      title: "Landle Settings",
      properties: {
        "landle.editAsync": {
          type: "boolean",
          default: false,
          description: "Perform edit in async"
        },
        "landle.autoSaveAfterEdit": {
          type: "boolean",
          default: true,
          description: "Trigger document save after extension formatting is complete"
        },
        "landle.autoTriggerOnSave": {
          description: "Commands group to execute on editor save. Selecting one of the commands will automatically select entire document. Recommand to turn off vscode's autosave feature if you are using this feature. ",
          type: "string",
          enum: [
            "disabled",
            "blockCommentWordCountJustifyAlign",
            "cleanUBlockCommentCommand",
            "cleanUpDocumentCommand",
            "cleanUpCodeCommand"
          ],
          enumDescriptions: [
            "disabled",
            "blockCommentWordCountJustifyAlign",
            "cleanUBlockCommentCommand",
            "cleanUpDocumentCommand",
            "cleanUpCodeCommand"
          ],
          default: "disabled"
        },
        "landle.addExtraLineAtEndOnBlockComment": {
          type: "boolean",
          default: true,
          description: "To add extra empty block comment line at the block ends"
        },
        "landle.deleteCommentAlsoDeleteBlockComment": {
          type: "boolean",
          default: false,
          description: "Enable delete comment command also delete block-comments"
        },
        "landle.blockCommentWordCountJustifyAlign": {
          type: "boolean",
          default: true,
          description: "Enable block-comment lines justitfy align based on line character length."
        },
        "landle.blockCommentCharacterBoundaryBaseLength": {
          type: "number",
          default: 70,
          description: "Block-comment auto length configuration for base length"
        },
        "landle.blockCommentCharacterBoundaryToleranceLength": {
          type: "number",
          default: 10,
          description: "Block-comment auto length configurations for tolance length"
        },
        "landle.removeWhitespaceBeforeInlineComment": {
          type: "boolean",
          default: false,
          description: "Remove Whitespace Of Inline Comment."
        },
        "landle.removeWhitespaceOflineComment": {
          type: "boolean",
          default: false,
          description: "Remove All Whitespace Of Line Comment."
        },
        "landle.removeWhitespaceBetweenAnnotation": {
          type: "boolean",
          default: true,
          description: "Remove All Whitespace Of Line Comment."
        },
        "landle.addEmptyBlockCommentLineInAnnotation": {
          type: "boolean",
          default: true,
          description: "Add empty block comment in between Annotations."
        }
      }
    }
  },
  scripts: {
    "vscode:prepublish": "pnpm run package",
    compile: "pnpm run check-types && pnpm run lint && node esbuild.js",
    watch: "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch --project tsconfig.json",
    package: "pnpm run check-types && pnpm run lint && node esbuild.js --production",
    "compile-tests": "tsc -p . --outDir out",
    "watch-tests": "tsc -p . -w --outDir out",
    pretest: "pnpm run compile-tests && pnpm run compile && pnpm run lint",
    "check-types": "tsc --noEmit",
    lint: "eslint src",
    test: "vscode-test"
  },
  devDependencies: {
    "@types/vscode": "^1.96.0",
    "@types/mocha": "^10.0.10",
    "@types/node": "20.x",
    "@typescript-eslint/eslint-plugin": "^8.17.0",
    "@typescript-eslint/parser": "^8.17.0",
    eslint: "^9.16.0",
    esbuild: "^0.24.0",
    "npm-run-all": "^4.1.5",
    typescript: "^5.7.2",
    "@vscode/test-cli": "^0.0.10",
    "@vscode/test-electron": "^2.4.1"
  }
};

// src/common/config.ts
var vscode = __toESM(require("vscode"));
var currentConfig = (() => {
  return vscode.workspace.getConfiguration(package_default.name);
})();
var Config = class {
  #currentConfig;
  #configuration = currentConfig;
  #configCollection;
  constructor() {
    this.#readConfiguration();
  }
  #checkBlockCommentCharacterBoundaryBaseLength = () => {
    let blockCommentCharacterBoundaryBaseLength = this.#configuration.get("blockCommentCharacterBoundaryBaseLength", 10);
    blockCommentCharacterBoundaryBaseLength = blockCommentCharacterBoundaryBaseLength >= 10 ? blockCommentCharacterBoundaryBaseLength : 10;
    this.update("blockCommentCharacterBoundaryToleranceLength", 10, vscode.ConfigurationTarget.Global);
    return blockCommentCharacterBoundaryBaseLength;
  };
  #readConfiguration() {
    this.#configuration = currentConfig;
    this.#configCollection = {
      editAsync: this.#configuration.get("editAsync", false),
      autoSaveAfterEdit: this.#configuration.get("autoSaveAfterEdit", true),
      autoTriggerOnSave: this.#configuration.get("autoTriggerOnSave", "disabled"),
      addExtraLineAtEndOnBlockComment: this.#configuration.get("addExtraLineAtEndOnBlockComment", false),
      deleteCommentAlsoDeleteBlockComment: this.#configuration.get("deleteCommentAlsoDeleteBlockComment", false),
      blockCommentWordCountJustifyAlign: this.#configuration.get("blockCommentWordCountJustifyAlign", true),
      blockCommentCharacterBoundaryBaseLength: this.#checkBlockCommentCharacterBoundaryBaseLength(),
      blockCommentCharacterBoundaryToleranceLength: this.#configuration.get("blockCommentCharacterBoundaryToleranceLength", 10),
      removeWhitespaceBeforeInlineComment: this.#configuration.get("removeWhitespaceBeforeInlineComment", true),
      removeWhitespaceOflineComment: this.#configuration.get("removeWhitespaceOflineComment", true),
      removeWhitespaceBetweenAnnotation: this.#configuration.get("removeWhitespaceBetweenAnnotation", true),
      addEmptyBlockCommentLineInAnnotation: this.#configuration.get("addEmptyBlockCommentLineInAnnotation", true)
    };
  }
  get of() {
    return { ...this.#configCollection };
  }
  updateConfig = () => {
    this.#readConfiguration();
  };
  update = (section, value, configurationTarget) => {
    this.#configuration.update(section, value, configurationTarget);
  };
};
var config = new Config();

// src/editor/Event.ts
var vscode2 = __toESM(require("vscode"));
var import_events = require("events");
var Event = class extends import_events.EventEmitter {
  #directCall = true;
  constructor() {
    super();
    this.#autoSaveEventSwitch();
  }
  #autoSaveEventSwitch = () => {
    this.on("AUTO_TRIGGER_ON_SAVE_SWITCH" /* AUTO_TRIGGER_ON_SAVE_SWITCH */, (directCallStatus) => {
      this.#directCall = directCallStatus;
    });
  };
  pushMessage = (message) => {
    vscode2.window.showInformationMessage(message);
  };
  saveActiveEditor = (editor) => {
    try {
      editor.document.save().then((res) => {
        if (!res) {
          this.pushMessage("Save on active editor failed:");
        }
      });
    } catch (err) {
      this.pushMessage("Save on active editor failed:" + err);
    }
  };
  checkKeybindCollision = () => {
  };
  onDidChangeActiveTextEditor = () => {
    return vscode2.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
      }
    });
  };
  autoTriggerOnSaveEvent = () => {
    return vscode2.workspace.onWillSaveTextDocument((event) => {
      if (config.of.autoTriggerOnSave !== "disabled" && this.#directCall) {
        vscode2.commands.executeCommand(package_default.name + "." + config.of.autoTriggerOnSave, { includeEveryLine: true });
      }
    });
  };
  autoTriggerOnSaveResetEvent = () => {
    return vscode2.workspace.onDidSaveTextDocument((event) => {
      this.#directCall = true;
    });
  };
  onDidChangeConfiguration = () => {
    return vscode2.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(package_default.name + "blockCommentCharacterBoundaryToleranceLength")) {
        const value = config.of.blockCommentCharacterBoundaryToleranceLength;
        if (value < 5) {
          this.pushMessage("Block Comment Length Tolerance can not be less than 10");
          config.update("blockCommentCharacterBoundaryToleranceLength", 10, vscode2.ConfigurationTarget.Global);
        }
      }
      config.updateConfig();
      this.#directCall = true;
    });
  };
};
var eventInstance = new Event();

// src/editor/ActiveEditor.ts
var vscode5 = __toESM(require("vscode"));

// src/editor/Function/Line.ts
var vscode3 = __toESM(require("vscode"));

// src/type/LineType.d.ts
var LineType;
((LineType2) => {
  let LineEditType;
  ((LineEditType2) => {
    LineEditType2[LineEditType2["APPEND"] = 1] = "APPEND";
    LineEditType2[LineEditType2["PREPEND"] = 2] = "PREPEND";
    LineEditType2[LineEditType2["REPLACE"] = 4] = "REPLACE";
    LineEditType2[LineEditType2["CLEAR"] = 8] = "CLEAR";
    LineEditType2[LineEditType2["DELETE"] = 16] = "DELETE";
  })(LineEditType = LineType2.LineEditType || (LineType2.LineEditType = {}));
  let RangeKind;
  ((RangeKind2) => {
    RangeKind2[RangeKind2["DOCUMENT"] = 1] = "DOCUMENT";
    RangeKind2[RangeKind2["MULTILINE"] = 2] = "MULTILINE";
    RangeKind2[RangeKind2["LINE"] = 4] = "LINE";
  })(RangeKind = LineType2.RangeKind || (LineType2.RangeKind = {}));
  let LineEditBlockPriority;
  ((LineEditBlockPriority2) => {
    LineEditBlockPriority2[LineEditBlockPriority2["UNSET"] = 0] = "UNSET";
    LineEditBlockPriority2[LineEditBlockPriority2["LOW"] = 1] = "LOW";
    LineEditBlockPriority2[LineEditBlockPriority2["MID"] = 2] = "MID";
    LineEditBlockPriority2[LineEditBlockPriority2["HIGH"] = 3] = "HIGH";
    LineEditBlockPriority2[LineEditBlockPriority2["VERYHIGH"] = 4] = "VERYHIGH";
    LineEditBlockPriority2[LineEditBlockPriority2["SKIP_LINE"] = 5] = "SKIP_LINE";
  })(LineEditBlockPriority = LineType2.LineEditBlockPriority || (LineType2.LineEditBlockPriority = {}));
})(LineType || (LineType = {}));

// src/editor/Function/Line.ts
var Line = class _Line {
  static doc;
  static editor;
  // constructor() {
  // }
  // =============================================================================
  // > PRIVATE FUNCTIONS:
  // =============================================================================
  /**
   * unused. for future reference.
   *
   * @param range unused
   * @returns unused
   *
   */
  #getLineNumbersFromRange = (range) => {
    const startLine = range.start.line;
    const endLine = range.end.line;
    return { startLine, endLine };
  };
  /**
   * unused. staple for future reference.
   *
   * @param range unused
   * @returns unused
   *
   */
  #editLineBindOnCondition = (range, callback, cond) => {
    return cond ? {
      ...callback.func(_Line.lineFullRange(range)),
      type: callback.type
    } : void 0;
  };
  // =============================================================================
  // > PROTECTED FUNCTIONS:
  // =============================================================================
  static set setCurrentDocument(editor) {
    this.editor = editor;
  }
  /**
   * get EOL of current document set
   *
   * @returns
   *
   */
  static getEndOfLine = () => this.editor.document.eol === vscode3.EndOfLine.CRLF ? "\r\n" : "\n";
  /**
   * get text as string from range
   *
   * @param range target range
   * @returns text as string
   *
   */
  static getText = (range) => {
    return this.editor.document.getText(range);
  };
  /**
   * get TextLine object from range or from line number.
   *
   * @param range target range
   * @returns TextLine object of range or line.
   *
   */
  static getTextLineFromRange = (range, lineDelta = 0) => {
    if (typeof range === "number") {
      if (range + lineDelta >= this.editor.document.lineCount) {
        return this.editor.document.lineAt(range);
      }
      return this.editor.document.lineAt(range + lineDelta);
    }
    if (range.start.line + lineDelta < 0) {
      return this.editor.document.lineAt(range.start.line);
    }
    if (this.editor.document.lineCount > range.start.line + lineDelta) {
      return this.editor.document.lineAt(range.start.line + lineDelta);
    }
    return this.editor.document.lineAt(range.start.line);
  };
  /**
   * get the range of entire line including EOL.
   *
   * @param range target range
   * @returns
   *
   */
  static lineFullRangeWithEOL = (range) => {
    return this.getTextLineFromRange(range).rangeIncludingLineBreak;
  };
  /**
   * create new range with line number, starting position and end position
   *
   * @param lineNuber line number of new range object
   * @param startPosition starting position of range
   * @param endPosition end position of range
   * @returns
   *
   */
  static newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
    return new vscode3.Range(
      new vscode3.Position(lineNuber, startPosition),
      new vscode3.Position(lineNuber, endPosition)
    );
  };
  static iterateNextLine = (range, lineCondition, continueCheck, trueConditionTask, lineModifiyTask) => {
    let lineNumber = range.start.line;
    let currTextLine;
    let condition = true;
    let newLine = "";
    let lineMod = void 0;
    const lineSkip = [];
    const lineCount = this.editor.document.lineCount;
    while (lineNumber < lineCount) {
      currTextLine = this.getTextLineFromRange(lineNumber).text;
      lineMod = lineModifiyTask?.(currTextLine);
      if (lineMod) {
        currTextLine = lineMod;
      }
      if (typeof lineCondition === "function") {
        condition = lineCondition(currTextLine);
      }
      if (!condition) {
        break;
      }
      newLine += currTextLine + this.getEndOfLine();
      lineSkip.push(lineNumber);
      lineNumber++;
      if (continueCheck?.(currTextLine)) {
        continue;
      }
      trueConditionTask?.(currTextLine);
    }
    ;
    return lineSkip.length > 0 ? {
      lineNumber,
      lineSkip,
      string: newLine,
      range: new vscode3.Range(
        new vscode3.Position(range.start.line, 0),
        new vscode3.Position(lineNumber, 0)
      )
    } : void 0;
  };
  static iterateNextLineOfLineArray = (range, lineCondition, continueCheck, trueConditionTask, lineModifiyTask) => {
    return;
  };
  static checkIfRangeTextIsEqual = (range, newText) => {
    return this.editor.document.getText(range) === newText;
  };
  // =============================================================================
  // > PUBLIC static FUNCTIONS:
  // =============================================================================
  /**
   * get the range of line with any characters including whitespaces.
   *
   * @param range vscode.Range | number.
   * @returns first line of the range or whole line of the the line number.
   *
   */
  static lineFullRange = (range) => {
    if (typeof range === "number") {
      return this.editor.document.lineAt(range).range;
    }
    return this.editor.document.lineAt(range.start.line).range;
  };
  static rangeKind = (range) => {
    if (range.isEmpty || range.isSingleLine) {
      return LineType.RangeKind.LINE;
    }
    if (range.start.line === 0 && range.end.line === this.editor.document.lineCount) {
      return LineType.RangeKind.DOCUMENT;
    }
    return LineType.RangeKind.MULTILINE;
  };
  /**
   * @returns
   *
   */
  static setCurrentEditor = (editor) => {
    this.editor = editor;
  };
};

// src/editor/Handler/BaseHandler.ts
var vscode4 = __toESM(require("vscode"));
var BaseHandler = class {
  static editor;
  // public abstract setActiveEditor(editor?: vscode.TextEditor): void;
  static loadEditor = () => {
    const activeEditor = vscode4.window.activeTextEditor;
    if (activeEditor) {
      this.editor = activeEditor;
      return;
    }
  };
};

// src/editor/ActiveEditor.ts
var ActiveEditor = class {
  // unused. for future reference.
  #editorText;
  #editor;
  // #lineHandler: InstanceType<typeof LineHandler>;
  #cursorLine;
  #cursorPosition;
  #cursorReposition;
  #cursorSelection;
  constructor() {
    this.#documentSnapshot();
  }
  /**
   * get current active text editor
   * 
   * @returns
   * 
   */
  #setActiveEditor = () => {
    const activeEditor = vscode5.window.activeTextEditor;
    if (activeEditor) {
      this.#editor = activeEditor;
      this.#cursorSelection = this.#editor.selections[this.#editor.selections.length - 1];
      this.#cursorLine = this.#cursorSelection.end.line;
      this.#cursorPosition = this.#cursorSelection.end.character;
      this.#cursorReposition = { moveDown: 0, moveUp: 0 };
      BaseHandler.loadEditor();
      Line.setCurrentEditor(activeEditor);
    }
  };
  /**
   * reset cursor position as well as the selection.
   * 
   */
  #selectionReset = () => {
    let resetLine = 0;
    if (this.#cursorReposition.moveUp !== 0 || this.#cursorReposition.moveDown !== 0) {
      resetLine = this.#cursorLine + this.#cursorReposition.moveUp - this.#cursorReposition.moveDown;
      this.#cursorReposition = { moveDown: 0, moveUp: 0 };
    } else {
      resetLine = this.#cursorSelection.end.line;
    }
    this.#editor.selection = new vscode5.Selection(
      new vscode5.Position(resetLine, this.#cursorPosition),
      new vscode5.Position(resetLine, this.#cursorPosition)
    );
  };
  #cursorControl = (range) => {
    const rangeLineCount = range.end.line - range.start.line;
    const isDeleteSingleLine = rangeLineCount === 1 && range.isSingleLine;
    const startLine = range.start.line;
    const endLine = range.end.line;
    const isCursorInRange = this.#cursorLine >= startLine && this.#cursorLine <= endLine;
    if (!isDeleteSingleLine) {
      if (isCursorInRange) {
        this.#cursorLine = startLine;
      } else {
        if (this.#cursorLine >= endLine) {
          this.#cursorReposition.moveDown += rangeLineCount;
        }
      }
    } else {
      if (this.#cursorLine >= endLine) {
        this.#cursorReposition.moveDown++;
      }
    }
  };
  /**
   * function that store current document if no arugment is supplied.
   * if arguement supplied in function call; it compares last cached
   * document with argument and comparing if the document has been modified.
   * @param editorText
   * @returns boolean
   * - true when no argument supplied indicate the editor has been cached.
   * - true when argument supplied indicate document has not been modified.
   * - false when arguement supplied indiciate document has been modified.
   * 
   */
  #documentSnapshot = (editorText = void 0) => {
    if (editorText === void 0) {
      if (editorText !== this.#editorText) {
        this.#editorText = this.#editor.document.getText();
      }
      return true;
    } else {
      return editorText === this.#editorText;
    }
  };
  /**
   * this function will perform edit with it's given range with string.
   * 
   * @param edit :LineType.LineEditType will have the; range, type, string
   * @param editBuilder as it's type.
   * 
   */
  #editSwitch = (edit, editBuilder) => {
    if (edit.type) {
      if (edit.type & LineType.LineEditType.DELETE) {
        if (!edit.range.isSingleLine) {
          this.#cursorControl(edit.range);
        }
        editBuilder.delete(edit.range);
      }
      if (edit.type & LineType.LineEditType.CLEAR) {
        editBuilder.delete(Line.lineFullRange(edit.range));
      }
      if (edit.type & LineType.LineEditType.APPEND) {
        console.log(edit);
        editBuilder.insert(edit.range.start, edit.string ?? "");
      }
      if (edit.type & LineType.LineEditType.REPLACE) {
        editBuilder.replace(edit.range, edit.string ?? "");
      }
      if (edit.type & LineType.LineEditType.PREPEND) {
      }
    }
    ;
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS:
  // =============================================================================
  setCurrentEditor = (editor) => {
    this.#editor = editor;
  };
  /**
   * returns object literal of class linHandler with it's method.
   * @return private instance of lineHandler
   * 
   */
  setLineHandler = (lineHandler) => {
  };
  /**
   * it picks up current editor then, will iterate for each selection
   * range in the curernt open editor, and stack the callback function
   * references. each selection could be either; empty or singleline
   * or multiple lines but they will be handled in the Line class.
   * 
   * it could have not started to ieterate if the selection is not a
   * multiple line, however then it more conditions need to be checked
   * in this class function. beside, if choose not to iterate, means,
   * will not use array, the arugment and it's type will not be an array
   * or either explicitly use array with a single entry. that will end
   * up line handling to either recieve array or an single callback object
   * which is inconsistance. plus, it is better to handle at one execution
   * point and that would be not here.
   * 
   * @param callback line edit function and there could be more than one edit required.
   * @param includeCursorLine unused. for future reference.
   * 
   */
  prepareEdit = (callback, commandOption) => {
    this.#setActiveEditor();
    if (commandOption.editAsync) {
    } else {
      const editSchedule = [];
      if (commandOption.includeEveryLine) {
        const range = new vscode5.Selection(
          new vscode5.Position(0, 0),
          new vscode5.Position(this.#editor.document.lineCount - 1, 0)
        );
        editSchedule.push(...this.prepareLines(range, callback));
      } else {
        const selections = this.#editor.selections;
        selections.forEach((range) => {
          editSchedule.push(...this.prepareLines(range, callback));
        });
      }
      if (editSchedule.length > 0) {
        this.editInRange(editSchedule).catch((err) => {
          console.error("Edit Failed:", err);
        }).finally(() => {
          this.#selectionReset();
        });
      } else {
        this.#selectionReset();
        console.log("No edit found.");
      }
    }
  };
  /**
   * this private function is a wrap and shape the return object for
   * each callback for a line. the function will take current range with
   * callback and execute to get the information how to edit the line,
   * which described in object with type of LineEditInfo. this is where
   * the default blocking value will be set to block additional edit
   * on line; default for blocking the edit is true, and it is false
   * if it is not defined in callback object.
   *
   * this means that only a function with block:true will be executed
   * and every other callbacks will be drop for the further.
   *
   * @param currntRange
   * @param fn
   * @param _lineEdit_
   * @returns LineType.LineEditInfo | undefined
   *
   */
  #editedLineInfo = (currntRange, fn) => {
    const editInfo = fn.func(currntRange);
    if (editInfo) {
      if (fn.block || editInfo.block) {
        return {
          name: editInfo.name,
          range: editInfo.range,
          string: editInfo?.string,
          type: editInfo.type ? editInfo.type : fn.type,
          block: {
            priority: editInfo.block?.priority ? editInfo.block?.priority : fn.block?.priority,
            lineSkip: editInfo.block?.lineSkip
          }
        };
      } else {
        return {
          ...editInfo,
          type: editInfo.type ? editInfo.type : fn.type
        };
      }
    }
  };
  /**
   * this is the mian loop to iterate the callbacks that are defined
   * from command class. there is a object key named block. when the
   * property block is true, it will drop all the added edit, and assign
   * itself and stops further iteration to prevent no more changes to
   * be applied to when the for loop is finished, it will be stacked
   * into _line_edit_
   *
   * this iteration could well have been done in array.reduce but it
   * does unnecessary exection in the iteartion. so thats why it is for
   * loop.
   *
   * @param range
   * @param callback
   * @returns LineType.LineEditInfo[]
   * 
   */
  #handleLineEdit = (range, callback) => {
    let currentLineEdit = [];
    let priority = LineType.LineEditBlockPriority.UNSET;
    let blockFlag = false;
    for (const fn of callback) {
      const result = this.#editedLineInfo(range, fn);
      if (result) {
        if (result.block) {
          if (result.block.priority > priority) {
            currentLineEdit = [result];
            priority = result.block.priority;
            blockFlag = true;
          }
        } else if (!blockFlag) {
          currentLineEdit.push(result);
        }
      }
    }
    return currentLineEdit;
  };
  /**
   * this funciton will iterate each line and stack the line edit object.
   * iteration will continue unitl the current line number is less than
   * less than line number of the each selection. the range at this point
   * of will represent a single range and not entire document. callback
   * will be a list of callbacks to check/apply to each line. _lineEdit_
   * variable are being used as a references so no direct assignement
   * becuase the is what this function will return upon the end of the
   * iteration.
   *
   * there is a for loop that will iterate each every callback. the problem
   * with js array api is it lacks handling the undefined value being
   * in api functions rather, you have to chain them. using array api
   * in object (becuase it is what it needs to iterate on), the type
   * mismatch forces to return either a typed object or undefined becasuse
   * the will have a return type. this means the reseult of the iteration
   * will contain undefiend item if callback returns undefined and it
   * 
   * makes to iterate twice to filter them for each every line. further
   * 
   * explanation continues
   *
   * @param range
   * @param callback
   * @param currentLineNumber
   * @param _lineEdit_
   * @returns IterateLineType[]
   *
   */
  #lineIteration = (range, callback, currentLineNumber, _lineEdit_, lineSkip) => {
    lineSkip = lineSkip ?? /* @__PURE__ */ new Set();
    while (currentLineNumber <= range.end.line) {
      if (lineSkip.has(currentLineNumber)) {
        currentLineNumber++;
        continue;
      }
      const currentLineEdit = this.#handleLineEdit(Line.lineFullRange(currentLineNumber), callback);
      if (currentLineEdit.length > 0) {
        if (currentLineEdit[0].block) {
          if (currentLineEdit[0].block.lineSkip) {
            currentLineEdit[0].block.lineSkip.forEach((line) => lineSkip.add(line));
          }
        }
        _lineEdit_.push(...currentLineEdit);
      }
      currentLineNumber++;
    }
    return _lineEdit_;
  };
  /**
   * take range as a single selection that could be a single line, empty
   * (cursor only) or mulitple lines. the callback will be defined in
   * Command.ts. this function will return either a single LineEditInfo
   * or array of them to schedule the document edit. if the selection
   * is either of empty (whitespaces only) or a single line, the range
   * should be the whole line.
   *
   * @param range
   * @param callback
   * @returns
   *
   */
  prepareLines = (range, callback) => {
    const targetLine = range.start.line;
    if (range.isEmpty || range.isSingleLine) {
      return this.#handleLineEdit(Line.lineFullRange(targetLine), callback);
    }
    return this.#lineIteration(
      range,
      callback,
      targetLine,
      []
    );
  };
  /**
   * performes aysnc edit and aplit it all at once they are complete.
   * 
   * @param lineCallback collecion of edits for the document how and where to edit.
   * @returns Promise<void>
   * 
   */
  editInRange = async (lineCallback) => {
    try {
      const success = await this.#editor.edit((editBuilder) => {
        lineCallback.forEach((edit) => this.#editSwitch(edit, editBuilder));
      });
      if (!success) {
        throw new Error("Failed to apply edit.");
      }
      this.#documentSnapshot();
      console.log("Edit applied successfully!");
      if (config.of.autoSaveAfterEdit) {
        eventInstance.emit("AUTO_TRIGGER_ON_SAVE_SWITCH" /* AUTO_TRIGGER_ON_SAVE_SWITCH */, false);
        eventInstance.saveActiveEditor(this.#editor);
      }
      if (!this.#documentSnapshot(vscode5.window.activeTextEditor?.document.getText())) {
        console.log("Duplicate edit entry");
      }
    } catch (err) {
      console.error("Error applying edit:", err);
      return Promise.reject(err);
    }
  };
};

// src/editor/Handler/LineHandler.ts
var vscode6 = __toESM(require("vscode"));

// src/common/Util.ts
var LineUtil;
((LineUtil2) => {
  LineUtil2.generic = {};
  LineUtil2.blockComment = {};
  LineUtil2.inlineComment = {};
  LineUtil2.removeTrailingWhiteSpaceString = (line) => line.replace(/[ \t]+$/, " ");
  LineUtil2.findTrailingWhiteSpaceString = (line) => line.search(/\s+$/m);
  LineUtil2.findNonWhitespaceIndex = (line) => line.search(/\S/g);
  LineUtil2.findReverseNonWhitespaceIndex = (line) => line.search(/\S(?=\s*$)/g);
  LineUtil2.removeMultipleWhiteSpaceString = (line) => line.replace(/\s\s+/g, " ");
  LineUtil2.isMultipleWhiteSpace = (line) => /(?<=\S)\s+\s(?=\S)/.test(line);
  LineUtil2.findNextMultipleWhiteSpace = (line) => line.matchAll(/(?<=\S)\s+\s(?=\S)/g);
  LineUtil2.ifMultipleWhiteSpaceIsStringLiteral = (line) => /(['"])\s{2,}\1/.test(line);
  LineUtil2.isCommentOnlyLine = (line) => /^\s*\/\//g.test(line);
  LineUtil2.findCommentOnlyIndenetAndWhitespace = (line) => /^\s*(\/\/\s*)/g.exec(line);
  LineUtil2.isLineInlineComment = (line) => line.startsWith("//");
  LineUtil2.getInlineCommentFirstWhitespaces = (line) => line.match(/(?<=\/\/)\s+/g);
  LineUtil2.lineCommentWithWhitespace = (line) => /\s+\/\//g.exec(line);
  LineUtil2.isBlockComment2 = (line) => line.search(/^\s*\*+\s+\S+/s) !== -1;
  LineUtil2.isEmptyBlockComment = (line) => /^\s*\*\s*$/.test(line);
  LineUtil2.isBlockComment = (line) => /^\s*\*+/s.test(line);
  LineUtil2.isBlockCommnetDouble = (line) => /\*.+\*/s.test(line);
  LineUtil2.isBlockCommentWithCharacter = (line) => /^\s*\*+\s+\S+/s.test(line);
  LineUtil2.isBlockCommentNotEmpty = (line) => /^\s*\*+\s\S+/s.test(line);
  LineUtil2.checkBlockCommentNeedSkip = (line) => /^\s*\*\s*([-]|\d+\s*[-.])\s*/s.test(line);
  LineUtil2.isBlockCommentStartingLine = (line) => /^\s*\/\*/.test(line);
  LineUtil2.findBlockCommentStartingLineWithCharacter = (line) => /^\s*\/\*\*\s*\S/.exec(line);
  LineUtil2.isBlockCommentStartingLineWithCharacter = (line) => {
    const regex = /^\s*\/\*\*\s*\S/.exec(line);
    return regex !== null;
  };
  LineUtil2.isBlockCommentEndingLine = (line) => /^\s*\*\//.test(line);
  LineUtil2.isJSdocTag = (line) => /^\s*\*?\s*\@.*/s.test(line);
  LineUtil2.cleanBlockComment = (line) => line.replace(/(?<=\*).*/, "");
  LineUtil2.getlineCommentIndex = (line) => line.indexOf("//");
  LineUtil2.removeLineComment = (line) => line.substring(0, line.indexOf("//"));
  LineUtil2.getNowDateTimeStamp = /* @__PURE__ */ (() => ({
    custom: () => {
      function formatDate(date) {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        };
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        const formatter = new Intl.DateTimeFormat(locale, options);
        const parts = formatter.formatToParts(date);
        let year = "", month = "", day = "", hour = "", minute = "", ampm = "";
        parts.forEach((part) => {
          switch (part.type) {
            case "year":
              year = part.value;
              break;
            case "month":
              month = part.value;
              break;
            case "day":
              day = part.value;
              break;
            case "hour":
              hour = part.value;
              break;
            case "minute":
              minute = part.value;
              break;
            case "dayPeriod":
              ampm = part.value.toUpperCase();
              break;
          }
        });
        return `${year}-${month}-${day} (${hour}:${minute} ${ampm})`;
      }
      const currentDate = /* @__PURE__ */ new Date();
      return formatDate(currentDate);
    },
    locale: () => (/* @__PURE__ */ new Date()).toLocaleString(),
    iso: () => (/* @__PURE__ */ new Date()).toISOString()
  }))();
})(LineUtil || (LineUtil = {}));

// src/editor/Handler/LineHandler.ts
var LineHandler = class extends BaseHandler {
  /**
   * check if the document is starting with empty line and removes them.
   * 
   * @param range
   * @returns
   * 
   */
  static removeDocumentStartingEmptyLine = (range) => {
    let lineNumber = range.start.line;
    if (lineNumber === 0) {
      const lineIteration = Line.iterateNextLine(range, (line) => line.trim().length === 0);
      if (lineIteration) {
        return {
          name: "removeDocumentStartingEmptyLine",
          range: new vscode6.Range(
            new vscode6.Position(0, 0),
            new vscode6.Position(lineIteration.lineNumber, 0)
          ),
          block: {
            lineSkip: lineIteration.lineSkip,
            priority: LineType.LineEditBlockPriority.HIGH
          }
        };
      }
    }
    return;
  };
  /**
   * remove trailing whitespace lines from range if there is non-whitespace-character 
   * present.
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeTrailingWhiteSpace = (range) => {
    const textline = Line.getTextLineFromRange(range);
    let whitespacePos = LineUtil.findTrailingWhiteSpaceString(textline.text);
    let endPos = textline.text.length;
    if (LineUtil.isEmptyBlockComment(textline.text)) {
      if (whitespacePos < 0) {
        return;
      } else {
        if (whitespacePos === textline.text.indexOf("*") + 1) {
          return;
        }
      }
      whitespacePos += 1;
    }
    if (whitespacePos > 0 && textline.text.length >= whitespacePos + 1 && textline.text.length > 0 && !textline.isEmptyOrWhitespace) {
      return {
        name: "removeTrailingWhiteSpace",
        range: Line.newRangeZeroBased(range.start.line, whitespacePos, endPos)
      };
    }
    return;
  };
  /**
   * remove continous whitespaces that are longer than 1 from line when
   * there is non-whitespace -character present in line. this will ignore
   * indentation and edtiing range will start from fisrt non whitespace
   * character in the line. this funciton will keep the pre-edit range
   * to overwrite with whitespaces otherwise pre-edit characters will
   * be left in the line otherwise this callback would need to perform
   * two edit to achieve removing the whitespaces in delta bigger than
   * 1. resizing range will only affact to target range but not out or
   * range.
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeMultipleWhitespace = (range) => {
    const textLine = Line.getTextLineFromRange(range);
    let startPosition = textLine.firstNonWhitespaceCharacterIndex;
    if (LineUtil.isMultipleWhiteSpace(textLine.text) && !textLine.isEmptyOrWhitespace) {
      const newLineText = textLine.text.trim();
      let stringLiteral = false;
      const length = newLineText.length;
      let i = 0;
      let result = "";
      let lineComment = LineUtil.lineCommentWithWhitespace(newLineText);
      if (LineUtil.isBlockCommentWithCharacter(textLine.text)) {
        startPosition = textLine.text.indexOf("*");
      }
      const commentOnly = LineUtil.findCommentOnlyIndenetAndWhitespace(textLine.text);
      if (commentOnly) {
        return;
      }
      while (i++ < length) {
        const char = newLineText[i - 1];
        const isQuote = char === '"' || char === "'";
        if (isQuote) {
          stringLiteral = !stringLiteral;
        }
        if (isQuote || stringLiteral) {
          result += char;
          continue;
        }
        const previous = newLineText[i];
        if (char === " " && previous === " ") {
          if (lineComment) {
            if (lineComment.length > 0 && !config.of.removeWhitespaceBeforeInlineComment) {
              const commentLength = lineComment[0].length;
              i += commentLength - 1;
              result += lineComment[0];
              lineComment = lineComment.filter((value, index) => index !== 0);
            }
          }
          continue;
        } else {
          result += char;
        }
      }
      if (textLine.text !== result.padStart(startPosition + result.length, " ")) {
        return {
          name: "removeMultipleWhitespace",
          range: Line.newRangeZeroBased(
            range.start.line,
            startPosition,
            textLine.text.length
          ),
          string: result
        };
      }
    }
    return;
  };
  /**
   * check if the current cursor or selected range is empty line and
   * next. if both current and next is emtpy, remove current line.
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeMulitpleEmptyLine = (range) => {
    const previousLine = Line.getTextLineFromRange(range, -1);
    const currentLine = Line.getTextLineFromRange(range);
    if (range.end.line <= this.editor.document.lineCount && range.start.line > 0) {
      const nextLine = Line.getTextLineFromRange(range, 1);
      if (currentLine.isEmptyOrWhitespace && nextLine.isEmptyOrWhitespace && !LineUtil.isBlockComment(previousLine.text)) {
        return {
          name: "removeMulitpleEmptyLine",
          range: new vscode6.Range(
            new vscode6.Position(range.start.line - 1, previousLine.text.length),
            new vscode6.Position(range.start.line, 0)
          )
        };
      }
    }
    return;
  };
  /**
   * remove line if the line is commented
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeCommentedLine = (range) => {
    const lineText = Line.getText(range);
    const commentIndex = LineUtil.getlineCommentIndex(lineText);
    if (LineUtil.isCommentOnlyLine(lineText)) {
      return {
        name: "removeCommentedLine",
        range: Line.lineFullRangeWithEOL(range)
      };
    } else if (commentIndex !== -1) {
      return {
        name: "removeCommentedLine",
        range: Line.newRangeZeroBased(range.start.line, commentIndex - 1, lineText.length)
      };
    }
    return;
  };
  /**
   * remove line if the line is empty without characters.
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeEmptyLine = (range) => {
    const currentLine = Line.getTextLineFromRange(range).isEmptyOrWhitespace;
    if (currentLine) {
      return {
        name: "removeEmptyLine",
        range: Line.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  /**
   * check if the current cursor or selected range is empty line and
   * next. if both current and next is emtpy, remove current line.
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static removeDuplicateLine = (range) => {
    const currentLine = Line.getTextLineFromRange(range);
    const nextLine = Line.getTextLineFromRange(range, 1);
    if (currentLine.text === nextLine.text) {
      return {
        name: "removeDuplicateLine",
        range: Line.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  /**
   * funciton to print current datetime where the cursor is.
   * - locale
   * - iso
   * - custom
   * 
   * @param range target range, whichi will be the very starting of line.
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  static setNowDateTimeOnLine = (range) => {
    return {
      name: "setNowDateTimeOnLine",
      range,
      string: LineUtil.getNowDateTimeStamp.custom()
    };
  };
};

// src/editor/Handler/CommentHandler.ts
var vscode8 = __toESM(require("vscode"));

// src/editor/Function/Comment.ts
var vscode7 = __toESM(require("vscode"));
var Comment = class extends Line {
  /**
   * realign the block comment line here, based on base length in config
   * make the block comment almost justified aligned.
   * 
   * @param range
   * @param line
   * @returns
   * 
   */
  static blockCommentAligned = (range, line) => {
    if (line) {
      let indentIndex = 0;
      let indentString = "";
      let baseLine = range.start.line;
      const lineSkip = [baseLine];
      if (LineUtil.isBlockCommentStartingLineWithCharacter(line[0])) {
        indentIndex = line[0].indexOf("/*");
        indentString = "* ".padStart(indentIndex + 3, " ");
        line[0] = line[0].replace("/*", "");
        line = line.map((str) => str.replace("*", "").trim());
      } else {
        indentIndex = line[0].indexOf("/*");
        indentString = "* ".padStart(indentIndex + 3, " ");
        line = line.map((str) => str.replace("*", "").trim());
        line.shift();
      }
      const lineList = line.filter((str, index, arr) => {
        lineSkip.push(baseLine++);
        if (index > 0) {
          const isPrevLineEmpty = arr[index - 1].length === 0;
          const isCurrLineEmpty = arr[index].length === 0;
          if (isPrevLineEmpty && isCurrLineEmpty) {
            return false;
          }
        }
        return true;
      }).flatMap((line2) => {
        if (line2.length === 0) {
          return [Line.getEndOfLine()];
        } else {
          const splitLine = line2.split(/\s+/);
          splitLine.push(Line.getEndOfLine());
          return splitLine;
        }
      });
      let newLine = indentString;
      let newString = [];
      let removeEmptyStartLine = true;
      let annotationLine = false;
      for (const [index, str] of lineList.entries()) {
        if (LineUtil.isJSdocTag(str) && !annotationLine) {
          annotationLine = true;
          newString.push(indentString + this.getEndOfLine());
          newLine = indentString;
        }
        const textLineBiggerThanBase = newLine.length > config.of.blockCommentCharacterBoundaryBaseLength;
        const textLineLessThanBase = newLine.length < config.of.blockCommentCharacterBoundaryBaseLength;
        if (!annotationLine) {
          if (textLineBiggerThanBase) {
            newString.push(newLine + this.getEndOfLine());
            newLine = indentString;
            continue;
          }
          const strIsEOL = str === Line.getEndOfLine();
          const nextStrEOL = lineList[index + 1] === Line.getEndOfLine();
          if (textLineLessThanBase && strIsEOL && !nextStrEOL) {
            newLine += str + " ";
            continue;
          }
        }
        if (str === Line.getEndOfLine()) {
          if (newLine !== indentString) {
            removeEmptyStartLine = false;
          }
          if (removeEmptyStartLine) {
            continue;
          }
          if (config.of.removeWhitespaceBetweenAnnotation) {
            if (annotationLine) {
              if (newLine === indentString) {
                continue;
              }
            }
          }
          if (newLine === indentString) {
            newString.push(newLine + this.getEndOfLine());
          } else {
            if (newLine.indexOf(this.getEndOfLine()) !== -1) {
              const lineSplit = newLine.split(this.getEndOfLine());
              if (lineSplit.length > 1) {
                lineSplit.forEach((split) => {
                  if (split.indexOf("*") !== -1) {
                    newString.push(split + this.getEndOfLine());
                  } else {
                    newString.push(indentString + split.trim() + this.getEndOfLine());
                  }
                  newLine = indentString;
                });
                continue;
              }
            }
            newString.push(newLine.trimEnd() + this.getEndOfLine());
          }
          newLine = indentString;
        } else {
          newLine += str + " ";
        }
      }
      newString.unshift("/**".padStart(indentIndex + 3, " ") + this.getEndOfLine());
      if (config.of.addExtraLineAtEndOnBlockComment) {
        newString.push(indentString + this.getEndOfLine());
      }
      const newRange = new vscode7.Range(
        new vscode7.Position(range.start.line, 0),
        new vscode7.Position(range.start.line + line.length + 1, 0)
      );
      return {
        name: "blockCommentAligned",
        range: newRange,
        type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
        string: newString.join(""),
        block: {
          lineSkip,
          priority: LineType.LineEditBlockPriority.HIGH
        }
      };
    } else {
      const currTextLine = this.getTextLineFromRange(range);
      const isCurrBlockCommentStartingLine = LineUtil.isBlockCommentStartingLine(currTextLine.text);
      let includeOpenningLine = false;
      let lineRange = range;
      if (isCurrBlockCommentStartingLine) {
        if (LineUtil.isBlockCommentStartingLineWithCharacter(currTextLine.text)) {
          includeOpenningLine = true;
        }
      }
      if ((LineUtil.isBlockCommentWithCharacter(currTextLine.text) || includeOpenningLine) && !LineUtil.isJSdocTag(currTextLine.text) && !LineUtil.isBlockCommentEndingLine(currTextLine.text)) {
        const lineTextInArray = [];
        let indentIndex = currTextLine.text.indexOf("*");
        let indentString = currTextLine.text.substring(0, indentIndex + 1) + " ";
        let startPosition = 0;
        let newLine = indentString;
        let newString = "";
        let newStringArr = [];
        if (includeOpenningLine) {
          lineTextInArray.push(...currTextLine.text.replaceAll("/**", "").trim().split(/\s+/).filter((s) => s.length > 0));
          const nextTextLine = this.getTextLineFromRange(range, 1);
          indentIndex = nextTextLine.text.indexOf("*");
          indentString = nextTextLine.text.substring(0, indentIndex + 1) + " ";
          newLine = "";
          startPosition = currTextLine.text.indexOf("/**") + 3;
          newString += this.getEndOfLine() + indentString;
          newStringArr.push(this.getEndOfLine(), indentString);
          lineRange = new vscode7.Range(
            new vscode7.Position(range.start.line + 1, 0),
            new vscode7.Position(range.end.line + 1, 0)
          );
        }
        const lineCondition = (line2) => {
          let lineText = line2;
          if (LineUtil.isEmptyBlockComment(line2)) {
            return false;
          }
          if (LineUtil.isBlockCommentEndingLine(line2)) {
            return false;
          }
          const cond1 = LineUtil.isBlockCommentWithCharacter(line2);
          const cond2 = LineUtil.isBlockCommentStartingLineWithCharacter(line2);
          if (cond1 || cond2) {
            return true;
          }
          if (LineUtil.checkBlockCommentNeedSkip(line2)) {
            return true;
          }
          if (LineUtil.isJSdocTag(line2)) {
            return false;
          }
          const textLineLessThanBase = lineText.length < config.of.blockCommentCharacterBoundaryBaseLength;
          const textLineBiggerThanBaseAndTolerance = lineText.length > config.of.blockCommentCharacterBoundaryBaseLength + config.of.blockCommentCharacterBoundaryToleranceLength;
          if (textLineBiggerThanBaseAndTolerance || textLineLessThanBase) {
            return true;
          }
          return false;
        };
        const continueCheck = (line2) => {
          return LineUtil.isEmptyBlockComment(line2);
        };
        const trueConditionTask = (line2) => {
          lineTextInArray.push(...line2.replaceAll("*", "").trim().split(/\s+/).filter((s) => s.length > 0));
        };
        const lineIteration = this.iterateNextLine(lineRange, lineCondition, continueCheck, trueConditionTask);
        for (const str of lineTextInArray) {
          if (newLine.length - 1 > config.of.blockCommentCharacterBoundaryBaseLength) {
            newString += newLine.trimEnd() + this.getEndOfLine();
            newLine = indentString;
          }
          newLine += str + " ";
        }
        newString += newLine.trimEnd() + this.getEndOfLine();
        if (lineIteration) {
          const newRange = new vscode7.Range(
            new vscode7.Position(range.start.line, startPosition),
            new vscode7.Position(lineIteration.lineNumber, 0)
          );
          if (this.checkIfRangeTextIsEqual(newRange, newString)) {
            return;
          }
          return {
            name: "blockCommentWordCountJustifyAlign",
            range: newRange,
            type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
            string: newString,
            block: {
              lineSkip: lineIteration.lineSkip,
              priority: LineType.LineEditBlockPriority.HIGH
            }
          };
        }
        return;
      }
    }
    ;
  };
  /**
   * fix broken block commnet here, fill out comment character if the
   * formatis broken within the block.
   * 
   * @param range
   * @param indentSize
   * @returns
   * 
   */
  static fixedBlockComment = (range, indentSize) => {
    const lineCondition = (line) => {
      if (LineUtil.isBlockCommentEndingLine(line)) {
        return false;
      }
      return true;
    };
    const continueCheck = (line) => {
      return true;
    };
    const trueConditionTask = (line) => {
    };
    const lineModTask = (line) => {
      const indent = "".padStart(indentSize + 1, " ") + "* ";
      if (LineUtil.isBlockCommentStartingLine(line)) {
        return line;
      }
      if (LineUtil.isBlockComment(line)) {
        if (LineUtil.isBlockCommnetDouble(line)) {
          return indent + line.replaceAll("*", "").trimStart().split(/\s+/).filter((s) => s.length > 0).join(" ");
        }
        if (line.indexOf(" *") === indentSize) {
          return line;
        } else {
          return indent + line.replaceAll("*", "").trimStart();
        }
      } else {
        if (line.trim().length === 0) {
          return indent;
        } else {
          return indent + line.trim();
        }
      }
    };
    const lineIteration = this.iterateNextLine(
      range,
      lineCondition,
      continueCheck,
      trueConditionTask,
      lineModTask
    );
    if (lineIteration) {
      if (lineIteration.range && lineIteration.string) {
        if (Line.checkIfRangeTextIsEqual(lineIteration.range, lineIteration.string)) {
          return;
        }
      }
      return lineIteration;
    }
    return;
  };
};

// src/editor/Handler/CommentHandler.ts
var CommentHandler = class extends BaseHandler {
  /**
   * remove empty block comment line if the previous line is block comment
   * start
   * 
   * @param range
   * @returns
   * 
   */
  static removeEmptyBlockCommentLineOnStart = (range) => {
    const currentLine = Line.getTextLineFromRange(range);
    const beforeLine = Line.getTextLineFromRange(range, -1);
    const blockCommentStart = LineUtil.isBlockCommentStartingLine(beforeLine.text);
    if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
      const lineIteration = Line.iterateNextLine(range, (line) => LineUtil.isEmptyBlockComment(line));
      if (lineIteration) {
        return {
          name: "removeEmptyBlockCommentLineOnStart",
          range: new vscode8.Range(
            new vscode8.Position(range.start.line, 0),
            new vscode8.Position(lineIteration.lineNumber, 0)
          ),
          block: {
            priority: LineType.LineEditBlockPriority.MID,
            lineSkip: lineIteration.lineSkip
          }
        };
      }
    }
    return;
  };
  /**
   * remove current empty block comment line if next line is also empty
   * block comment line.
   * 
   * @param range
   * @returns
   * 
   */
  static removeMultipleEmptyBlockCommentLine = (range) => {
    const prevTextLine = Line.getTextLineFromRange(range, -1);
    const currTextLine = Line.getTextLineFromRange(range);
    const nextTextLine = Line.getTextLineFromRange(range, 1);
    const nextLineIsBlockCommend = LineUtil.isEmptyBlockComment(nextTextLine.text);
    const currLineIsBlockCommend = LineUtil.isEmptyBlockComment(currTextLine.text);
    const prevLineblockCommentStart = LineUtil.isBlockCommentStartingLine(prevTextLine.text);
    if (currLineIsBlockCommend && nextLineIsBlockCommend && !prevLineblockCommentStart) {
      return {
        name: "removeMultipleEmptyBlockCommentLine",
        range: Line.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  /**
   * insert empty block comment line if next line is block comment end
   * 
   * @param range
   * @returns
   * 
   */
  static insertEmptyBlockCommentLineOnEnd = (range) => {
    const prevLine = Line.getTextLineFromRange(range, -1);
    const currLine = Line.getTextLineFromRange(range);
    const currLineblockCommentEnd = LineUtil.isBlockCommentEndingLine(currLine.text);
    const prevLineblockCommentNonEmpty = LineUtil.isBlockCommentWithCharacter(prevLine.text);
    const indent = "*".padStart(prevLine.text.indexOf("*") + 1, " ");
    const newLine = indent + " " + Line.getEndOfLine() + indent + "/" + Line.getEndOfLine();
    if (currLineblockCommentEnd && prevLineblockCommentNonEmpty) {
      return {
        name: "insertEmptyBlockCommentLineOnEnd",
        range: new vscode8.Range(
          new vscode8.Position(range.start.line, 0),
          new vscode8.Position(range.start.line + 1, 0)
        ),
        string: newLine
      };
    }
    return;
  };
  /**
   * funciton removes empty-lines next block-comment lines.
   * 
   * @param range range of the line.
   * @returns LineEditInfo or undefined
   * 
   */
  static removeEmptyLinesBetweenBlockCommantAndCode = (range) => {
    const currentTextLine = Line.getTextLineFromRange(range);
    const previousTextLine = Line.getTextLineFromRange(range, -1);
    if (currentTextLine.isEmptyOrWhitespace && LineUtil.isBlockCommentEndingLine(previousTextLine.text)) {
      const lineIteration = Line.iterateNextLine(range, (line) => line.trim().length === 0);
      if (lineIteration) {
        return {
          name: "removeEmptyLinesBetweenBlockCommantAndCode",
          range: new vscode8.Range(
            new vscode8.Position(range.start.line, 0),
            new vscode8.Position(lineIteration.lineNumber, 0)
          ),
          type: LineType.LineEditType.DELETE,
          block: {
            lineSkip: lineIteration.lineSkip,
            priority: LineType.LineEditBlockPriority.HIGH
          }
        };
      }
    }
    return;
  };
  static fixBrokenBlockComment = (range) => {
    const currTextLine = Line.getTextLineFromRange(range);
    if (LineUtil.isBlockCommentStartingLine(currTextLine.text)) {
      const fixedComment = Comment.fixedBlockComment(range, currTextLine.text.indexOf("/*"));
      if (fixedComment) {
        return {
          name: "fixBrokenBlockCommnet",
          range: new vscode8.Range(
            new vscode8.Position(range.start.line, 0),
            new vscode8.Position(fixedComment.lineNumber, 0)
          ),
          string: fixedComment.string,
          type: LineType.LineEditType.REPLACE,
          block: {
            lineSkip: fixedComment.lineSkip,
            priority: LineType.LineEditBlockPriority.HIGH
          }
        };
      }
    }
    return;
  };
  /**
   * @param range
   * @returns
   * 
   */
  static blockCommentWordCountJustifyAlign = (range) => {
    const fixedBlockComment = this.fixBrokenBlockComment(range);
    if (fixedBlockComment) {
      return Comment.blockCommentAligned(range, fixedBlockComment.string?.split(Line.getEndOfLine()).filter((s) => s.length > 0));
    } else {
      return Comment.blockCommentAligned(range);
    }
    return;
  };
};

// src/editor/EditorCommand.ts
var editorCommandId = (() => {
  return package_default.contributes.commands.map((c) => {
    const cArray = c.command.split(".");
    return cArray[1];
  });
})();
var EditorCommand = class {
  #activeEditor;
  // #lineHandler: InstanceType<typeof LineHandler>;
  // #commentHandler: InstanceType<typeof CommentHandler>;
  constructor() {
    this.#activeEditor = new ActiveEditor();
  }
  // =============================================================================
  // > PUBLIC FUNCTIONS:
  // =============================================================================
  execute = (command, commandOption) => {
    console.clear();
    this.#activeEditor.prepareEdit(command, commandOption);
  };
  /**
   * @returns
   * 
   */
  removeDocumentStartingEmptyLine = () => {
    return {
      func: LineHandler.removeDocumentStartingEmptyLine,
      type: LineType.LineEditType.DELETE
    };
  };
  /**
   * removes trailing whitespace from the line.
   * 
   * @param editor unused, future reference
   * @param edit unused, future reference
   * @param args unused, future reference
   * 
   */
  removeTrailingWhitespaceFromSelection = (editor, edit, args) => {
    return {
      func: LineHandler.removeTrailingWhiteSpace,
      type: LineType.LineEditType.DELETE
    };
  };
  /**
   * removes multiple empty lines with EOL. this function will check if
   * thecurrnt range and next range are both whitespace lines and if true,
   * deletecurrent range with EOL. function type is
   * 
   */
  removeMulitpleEmptyLinesFromSelection = () => {
    return {
      func: LineHandler.removeMulitpleEmptyLine,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.MID
      }
    };
  };
  /**
   * removes whitespaces that are longer than 1. this function will ignore
   * indentation and keep the indent.
   * 
   */
  removeMultipleWhitespaceFromSelection = () => {
    return {
      func: LineHandler.removeMultipleWhitespace,
      type: LineType.LineEditType.REPLACE,
      block: {
        priority: LineType.LineEditBlockPriority.LOW
      }
    };
  };
  /**
   * remove all empty whitespace lines from selection function type is
   * line.delete.
   * 
   */
  removeEmptyLinesFromSelection = () => {
    return {
      func: LineHandler.removeEmptyLine,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.LOW
      }
    };
  };
  /**
   * remove all commented lines from selection function type is line.delete
   * with EOL.
   * 
   */
  removeCommentedTextFromSelection = () => {
    return {
      func: LineHandler.removeCommentedLine,
      type: LineType.LineEditType.DELETE
    };
  };
  /**
   * remove the current line if next line is identical as the current
   * one.
   * 
   */
  removeDuplicateLineFromSelection = () => {
    return {
      func: LineHandler.removeDuplicateLine,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.LOW
      }
    };
  };
  removeEmptyBlockCommentLineOnStart = () => {
    return {
      func: CommentHandler.removeEmptyBlockCommentLineOnStart,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.HIGH
      }
    };
  };
  removeMultipleEmptyBlockCommentLine = () => {
    return {
      func: CommentHandler.removeMultipleEmptyBlockCommentLine,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.MID
      }
    };
  };
  insertEmptyBlockCommentLineOnEnd = () => {
    return config.of.addExtraLineAtEndOnBlockComment ? {
      func: CommentHandler.insertEmptyBlockCommentLineOnEnd,
      type: LineType.LineEditType.DELETE + LineType.LineEditType.APPEND,
      block: {
        priority: LineType.LineEditBlockPriority.LOW
      }
    } : void 0;
  };
  blockCommentWordCountJustifyAlign = () => {
    return config.of.blockCommentWordCountJustifyAlign ? {
      func: CommentHandler.blockCommentWordCountJustifyAlign,
      type: LineType.LineEditType.REPLACE,
      block: {
        priority: LineType.LineEditBlockPriority.VERYHIGH
      }
    } : void 0;
  };
  fixBrokenBlockComment = () => {
    return {
      func: CommentHandler.fixBrokenBlockComment,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.VERYHIGH
      }
    };
  };
  removeEmptyLinesBetweenBlockCommantAndCode = () => {
    return {
      func: CommentHandler.removeEmptyLinesBetweenBlockCommantAndCode,
      type: LineType.LineEditType.DELETE,
      block: {
        priority: LineType.LineEditBlockPriority.HIGH
      }
    };
  };
  printNowDateTimeOnSelection = () => {
    return {
      func: LineHandler.setNowDateTimeOnLine,
      type: LineType.LineEditType.APPEND
    };
  };
};

// src/editor/EditorCommandGroup.ts
var EditorCommandGroup = class extends EditorCommand {
  constructor() {
    super();
  }
  cleanUpBlockCommentCommand = () => {
    return [
      this.removeEmptyBlockCommentLineOnStart(),
      this.removeMultipleEmptyBlockCommentLine(),
      this.insertEmptyBlockCommentLineOnEnd(),
      this.blockCommentWordCountJustifyAlign(),
      this.removeEmptyLinesBetweenBlockCommantAndCode()
    ].filter((fn) => fn !== void 0);
  };
  cleanUpCodeCommand = () => {
    return [
      this.removeDocumentStartingEmptyLine(),
      this.removeTrailingWhitespaceFromSelection(),
      this.removeMulitpleEmptyLinesFromSelection(),
      this.blockCommentWordCountJustifyAlign(),
      this.removeMultipleWhitespaceFromSelection()
    ].filter((fn) => fn !== void 0);
  };
  cleanUpDocumentCommand = () => {
    return [
      this.removeDocumentStartingEmptyLine(),
      this.removeTrailingWhitespaceFromSelection(),
      this.removeMulitpleEmptyLinesFromSelection(),
      this.removeMultipleWhitespaceFromSelection(),
      this.removeEmptyBlockCommentLineOnStart(),
      this.removeMultipleEmptyBlockCommentLine(),
      this.insertEmptyBlockCommentLineOnEnd(),
      this.blockCommentWordCountJustifyAlign(),
      this.removeEmptyLinesBetweenBlockCommantAndCode()
    ].filter((fn) => fn !== void 0);
  };
  cleanUpComments = () => {
    return [
      this.removeDocumentStartingEmptyLine(),
      this.removeTrailingWhitespaceFromSelection(),
      this.removeMulitpleEmptyLinesFromSelection(),
      this.removeMultipleWhitespaceFromSelection(),
      this.removeCommentedTextFromSelection()
    ].filter((fn) => fn !== void 0);
  };
};

// src/register.ts
var defaultParam = {
  includeEveryLine: false,
  autoSaveAfterEdit: config.of.autoSaveAfterEdit,
  editAsync: config.of.editAsync
};
var registerTextEditorCommand = (context, commandId, command) => {
  return commandId.map((id) => {
    if (id in command) {
      const commandString = [package_default.name, id].join(".");
      return vscode9.commands.registerTextEditorCommand(commandString, (editor, edit, params = defaultParam) => {
        const fn = Array.isArray(command[id]()) ? command[id]() : [command[id]()];
        command.execute(fn, params);
      });
    } else {
      console.log("command ", id, "has no implementation");
    }
  });
};
var Register = (context, handleLocal = true) => {
  const disposable = [];
  const editorCommandGroup = registerTextEditorCommand(context, editorCommandId, new EditorCommandGroup());
  disposable.push(...editorCommandGroup);
  disposable.push(eventInstance.onDidChangeActiveTextEditor());
  disposable.push(eventInstance.onDidChangeConfiguration());
  disposable.push(eventInstance.autoTriggerOnSaveEvent());
  disposable.push(eventInstance.autoTriggerOnSaveResetEvent());
  context.subscriptions.push(...disposable);
};

// src/extension.ts
function activate(context) {
  Register(context);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
