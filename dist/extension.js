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
var vscode4 = __toESM(require("vscode"));

// package.json
var package_default = {
  name: "lindle",
  displayName: "lindle",
  description: "lindle",
  version: "0.0.1",
  engines: {
    vscode: "^1.96.0"
  },
  categories: [
    "Other"
  ],
  activationEvents: [],
  main: "./dist/extension.js",
  contributes: {
    commands: [
      {
        command: "lindle.removeTrailingWhitespaceFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.removeMulitpleEmptyLinesFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.removeEmptyLinesFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.removeMultipleWhitespaceFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.cleanUpWhitespaceFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.removeCommentedTextFromSelection",
        title: "Hello World"
      },
      {
        command: "lindle.printNowDateTimeOnSelection",
        title: "Hello World"
      }
    ],
    keybindings: [
      {
        command: "lindle.removeTrailingWhitespaceFromSelection",
        key: "ctrl+alt+w"
      },
      {
        command: "lindle.removeMulitpleEmptyLinesFromSelection",
        key: "ctrl+alt+m"
      },
      {
        command: "lindle.removeEmptyLinesFromSelection",
        key: "ctrl+alt+e"
      },
      {
        command: "lindle.removeMultipleWhitespaceFromSelection",
        key: "ctrl+alt+space"
      },
      {
        command: "lindle.removeCommentedTextFromSelection",
        key: "ctrl+alt+/"
      },
      {
        command: "lindle.cleanUpWhitespaceFromSelection",
        key: "ctrl+alt+c"
      },
      {
        command: "lindle.printNowDateTimeOnSelection",
        key: "ctrl+alt+n"
      }
    ]
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

// src/editor/ActiveEditor.ts
var vscode3 = __toESM(require("vscode"));

// src/editor/Line.ts
var vscode2 = __toESM(require("vscode"));

// src/common/LineUtil.ts
var vscode = __toESM(require("vscode"));
var LineUtil = class {
  constructor() {
  }
  static getNowDateTimeStamp = () => {
    return (/* @__PURE__ */ new Date()).toLocaleString();
  };
  static removeTrailingWhiteSpaceString = (line) => {
    return line.replace(/[ \t]+$/, "");
  };
  static findTrailingWhiteSpaceString = (line) => {
    return line.search(/\s(?=\s*$)/g);
  };
  static findNonWhitespaceIndex = (line) => {
    return line.search(/\S/g);
  };
  static findReverseNonWhitespaceIndex = (line) => {
    return line.search(/\S(?=\s*$)/g);
  };
  static removeMultipleWhiteSpaceString = (line) => {
    return line.replace(/\s\s+/g, " ");
  };
  static getMultipleWhiteSpaceString = (line) => {
    return line.match(/(?<=\S)\s+(?=\S)/g);
  };
  static findMultipleWhiteSpaceString = (line) => {
    return line.search(/(?<=\S)\s+(?=\S)/g) !== -1;
  };
  static isLineCommented = (line) => {
    return line.search(/^\s*\/\//g) !== -1;
  };
  static pushMessage = (message) => {
    return vscode.window.showInformationMessage(message);
  };
  static splitStringOn(slicable, ...indices) {
    return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
  }
};

// src/editor/Line.ts
var Line = class {
  #doc;
  #edit;
  #editor;
  constructor() {
    this.#editor = vscode2.window.activeTextEditor;
    if (!this.#editor) {
      LineUtil.pushMessage("No Active Editor");
      return;
    } else {
      this.#doc = this.#editor.document;
    }
  }
  // =============================================================================
  // > PRIVATE FUNCTIONS: 
  // =============================================================================
  getText = (range) => {
    return this.#doc.getText(range);
  };
  getTextLineFromRange = (range, lineDelta = 0) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range + lineDelta);
    }
    if (this.#doc.lineCount > range.start.line + lineDelta) {
      return this.#doc.lineAt(range.start.line + lineDelta);
    }
    return this.#doc.lineAt(range.start.line);
  };
  lineFullRange = (range) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range).range;
    }
    return this.#doc.lineAt(range.start.line).range;
  };
  lineFullRangeWithEOL = (range) => {
    return this.getTextLineFromRange(range).rangeIncludingLineBreak;
  };
  getLineNumbersFromRange = (range) => {
    const startLine = range.start.line;
    const endLine = range.end.line;
    return { startLine, endLine };
  };
  newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
    return new vscode2.Range(
      new vscode2.Position(lineNuber, startPosition),
      new vscode2.Position(lineNuber, endPosition)
    );
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  editLineBindOnCondition = (range, callback, cond) => {
    return cond ? {
      ...callback.func(this.lineFullRange(range)),
      type: callback.type
    } : void 0;
  };
  editedLineInfo = (currntRange, fn, _lineEdit_) => {
    const editInfo = fn.func(currntRange);
    if (editInfo) {
      _lineEdit_.push({
        ...editInfo,
        type: fn.type
      });
    }
  };
  lineRecursion = (range, callback, currentLineNumber, _lineEdit_) => {
    if (currentLineNumber < range.end.line) {
      callback.forEach((fn) => {
        this.editedLineInfo(this.lineFullRange(currentLineNumber), fn, _lineEdit_);
      });
      this.lineRecursion(range, callback, currentLineNumber + 1, _lineEdit_);
    }
    return _lineEdit_;
  };
  prepareLines = (range, callback) => {
    const _lineEdit_ = [];
    if (range.isEmpty || range.isSingleLine) {
      callback.forEach((fn) => this.editedLineInfo(this.lineFullRangeWithEOL(range), fn, _lineEdit_));
      return _lineEdit_;
    }
    return this.lineRecursion(
      range,
      callback,
      range.start.line,
      _lineEdit_
    );
  };
  // =============================================================================
  // > PROTECTED FUNCTIONS: 
  // =============================================================================
  removeTrailingWhiteSpace = (range) => {
    const whitespacePos = LineUtil.findTrailingWhiteSpaceString(this.getText(range));
    if (whitespacePos >= 0 && !this.getTextLineFromRange(range).isEmptyOrWhitespace) {
      const textLineLength = this.getText(range).length;
      return {
        range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
      };
    }
    return;
  };
  removeMultipleWhitespace = (range) => {
    const lineText = this.getText(range);
    if (LineUtil.findMultipleWhiteSpaceString(lineText)) {
      const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
      const startPos = this.getTextLineFromRange(range).firstNonWhitespaceCharacterIndex;
      const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
      return {
        range: this.newRangeZeroBased(range.start.line, startPos, endPos),
        string: newLineText.padEnd(endPos, " ").trim()
      };
    }
    return;
  };
  removeMulitpleEmptyLine = (range) => {
    const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
    const nextLine = this.getTextLineFromRange(range, 1).isEmptyOrWhitespace;
    if (currentLine && nextLine) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  removeCommentedLine = (range) => {
    const lineText = this.getText(range);
    if (LineUtil.isLineCommented(lineText)) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  removeEmptyLines = (range) => {
    const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
    if (currentLine) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  setNowDateTimeOnLine = (range) => {
    return {
      range,
      string: LineUtil.getNowDateTimeStamp()
    };
    ;
  };
};

// src/editor/ActiveEditor.ts
var ActiveEditor = class extends Line {
  #documentSnapshot;
  #editor;
  constructor() {
    super();
    this.#editor = vscode3.window.activeTextEditor;
    if (this.#editor) {
      this.#documentSnapshot = this.#editor.document.getText();
    } else {
      return;
    }
  }
  editSwitch = (edit, editBuilder) => {
    if (edit.type) {
      switch (edit.type) {
        case 1 /* APPEND */:
          editBuilder.insert(edit.range.start, edit.string ?? "");
          break;
        case 8 /* CLEAR */:
          editBuilder.delete(this.lineFullRange(edit.range));
          break;
        case 32 /* DELETE */:
          editBuilder.delete(edit.range);
          break;
        case 4 /* REPLACE */:
          editBuilder.replace(edit.range, edit.string ?? "");
          break;
        case 2 /* PREPEND */:
          break;
        default:
      }
    }
    ;
  };
  // =============================================================================
  // > RPOTECED FUNCTIONS: 
  // =============================================================================
  snapshotDocument = () => {
    this.#documentSnapshot = vscode3.window.activeTextEditor?.document.getText();
  };
  // protected addEmptyLine = () => {
  //     if (this.#editor?.document.lineCount)
  // };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  prepareEdit = (callback, includeCursorLine) => {
    const editSchedule = [];
    const selections = this.#editor?.selections;
    selections?.forEach((range) => {
      editSchedule.push(...this.prepareLines(range, callback));
    });
    this.editInRange(editSchedule);
  };
  editInRange = async (lineCallback) => {
    try {
      const success = await this.#editor?.edit((editBuilder) => {
        lineCallback.forEach((edit) => this.editSwitch(edit, editBuilder));
      }).then();
      if (success) {
        console.log("Edit applied successfully!");
      } else {
        console.log("Failed to apply edit.");
      }
    } catch (err) {
      console.log("Error applying edit:", err);
    }
  };
};

// src/command.ts
var CommandId = ((CommandId2) => {
  CommandId2[CommandId2["removeTrailingWhitespaceFromSelection"] = 1 /* NO_RANGE_OVERLAPPING */ + 4 /* PRIORITY */] = "removeTrailingWhitespaceFromSelection";
  CommandId2[CommandId2["removeMulitpleEmptyLinesFromSelection"] = void 0] = "removeMulitpleEmptyLinesFromSelection";
  CommandId2[CommandId2["removeEmptyLinesFromSelection"] = void 0] = "removeEmptyLinesFromSelection";
  CommandId2[CommandId2["removeMultipleWhitespaceFromSelection"] = 1 /* NO_RANGE_OVERLAPPING */ + 2 /* IGNORE_ON_COLLISION */] = "removeMultipleWhitespaceFromSelection";
  CommandId2[CommandId2["removeCommentedTextFromSelection"] = void 0] = "removeCommentedTextFromSelection";
  CommandId2[CommandId2["cleanUpWhitespaceFromSelection"] = void 0] = "cleanUpWhitespaceFromSelection";
  CommandId2[CommandId2["printNowDateTimeOnSelection"] = void 0] = "printNowDateTimeOnSelection";
  return CommandId2;
})(CommandId || {});
var Command = class {
  // this.#ActiveEditor = new ActiveEditor();
  #ActiveEditor;
  #removeTrailingWhiteSpaceFromLine;
  #removeMultipleWhitespaceFromLine;
  #removeMulitpleEmptyLines;
  #removeCommentedTextFromLines;
  #removeEmptyLinesFromLine;
  #setNowDateTimeOnLineOnLine;
  constructor() {
    this.#ActiveEditor = new ActiveEditor();
    this.#removeTrailingWhiteSpaceFromLine = {
      func: this.#ActiveEditor.removeTrailingWhiteSpace,
      type: 32 /* DELETE */
    };
    this.#removeMultipleWhitespaceFromLine = {
      func: this.#ActiveEditor.removeMultipleWhitespace,
      type: 4 /* REPLACE */
    };
    this.#removeMulitpleEmptyLines = {
      func: this.#ActiveEditor.removeMulitpleEmptyLine,
      type: 32 /* DELETE */
    };
    this.#removeCommentedTextFromLines = {
      func: this.#ActiveEditor.removeCommentedLine,
      type: 32 /* DELETE */
    };
    this.#removeEmptyLinesFromLine = {
      func: this.#ActiveEditor.removeEmptyLines,
      type: 32 /* DELETE */
    };
    this.#setNowDateTimeOnLineOnLine = {
      func: this.#ActiveEditor.setNowDateTimeOnLine,
      type: 1 /* APPEND */
    };
  }
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  removeTrailingWhitespaceFromSelection = (editor, edit, args) => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeMulitpleEmptyLinesFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMulitpleEmptyLines
      ],
      false
    );
  };
  removeMultipleWhitespaceFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMultipleWhitespaceFromLine,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeEmptyLinesFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeEmptyLinesFromLine,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeCommentedTextFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeCommentedTextFromLines
      ],
      false
    );
  };
  cleanUpWhitespaceFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMultipleWhitespaceFromLine,
        this.#removeTrailingWhiteSpaceFromLine,
        this.#removeMulitpleEmptyLines
      ],
      false
    );
  };
  printNowDateTimeOnSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#setNowDateTimeOnLineOnLine
      ],
      false
    );
  };
  // public joinMultipleLines = () => {
  //     this.editorEdit(this.joinLines);
  // };
  // public joinCommnetLines = () => {
  //     this.editorEdit(this.joinLines);
  // };
};

// src/register.ts
var Register = (context, handleLocal = true) => {
  console.log("packageInfo.name", package_default.name);
  const disposable = [];
  const command = new Command();
  disposable.push(
    ...Object.keys(CommandId).filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key)).map((key) => {
      if (key in command) {
        return vscode4.commands.registerTextEditorCommand("lindle." + key, (editor, edit) => {
          const args = { lineEditFlag: CommandId[key] };
          command[key](editor, edit, args);
        });
      } else {
        console.log("command ", key, "has no implementation");
      }
    })
  );
  context.subscriptions.push(...disposable);
};

// src/extension.ts
function activate(context) {
  console.log('Hi, your extension "deco" is now active!');
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
