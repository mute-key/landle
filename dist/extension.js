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

// src/editor/ActiveEditor.ts
var vscode3 = __toESM(require("vscode"));

// src/editor/Line.ts
var vscode2 = __toESM(require("vscode"));

// src/common/util.ts
var vscode = __toESM(require("vscode"));
var LineUtil;
((LineUtil2) => {
  LineUtil2.getNowDateTimeStamp = () => (/* @__PURE__ */ new Date()).toLocaleString();
  LineUtil2.removeTrailingWhiteSpaceString = (line) => line.replace(/[ \t]+$/, "");
  LineUtil2.findTrailingWhiteSpaceString = (line) => line.search(/\s(?=\s*$)/g);
  LineUtil2.findReverseNonWhitespaceIndex = (line) => line.search(/\S(?=\s*$)/g);
  LineUtil2.removeMultipleWhiteSpaceString = (line) => line.replace(/\s\s+/g, " ");
  LineUtil2.getMultipleWhiteSpaceString = (line) => line.match(/(?<=\S)\s+(?=\S)/g);
  LineUtil2.findMultipleWhiteSpaceString = (line) => line.search(/(?<=\S)\s+(?=\S)/g) !== -1;
  LineUtil2.isLineCommented = (line) => line.search(/^\s*\/\//g) !== -1;
  LineUtil2.pushMessage = (message) => {
    return vscode.window.showInformationMessage(message);
  };
  function splitStringOn(slicable, ...indices) {
    return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
  }
  LineUtil2.splitStringOn = splitStringOn;
})(LineUtil || (LineUtil = {}));

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
  getTextLineOrRange = (range, offset = 0) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range + offset);
    }
    if (this.#doc.lineCount > range.start.line + offset) {
      return this.#doc.lineAt(range.start.line + offset);
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
    return this.getTextLineOrRange(range).rangeIncludingLineBreak;
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
  prepareLines = (editor, range, callback) => {
    const editList = [];
    if (range.isEmpty) {
      if (!Array.isArray(callback)) {
        return [{
          ...callback.func(this.lineFullRange(range)),
          type: callback.type
        }];
      }
    }
    if (range.isSingleLine) {
      if (!Array.isArray(callback)) {
        return [{
          ...callback.func(this.lineFullRange(range)),
          type: callback.type
        }];
      }
    }
    let currentLineNumber = range.start.line;
    while (currentLineNumber <= range.end.line) {
      const currentRange = this.lineFullRange(currentLineNumber);
      if (!Array.isArray(callback)) {
        const newLineObject = callback.func(this.lineFullRange(currentLineNumber));
        if (newLineObject) {
          editList.push({
            ...newLineObject,
            type: callback.type
          });
        }
      } else {
        callback.forEach((fnPerLine) => {
          const newLineObject = fnPerLine.func(this.lineFullRange(currentLineNumber));
          if (newLineObject) {
            editList.push({
              ...newLineObject,
              type: fnPerLine.type
            });
          }
        });
      }
      currentLineNumber++;
    }
    return editList;
  };
  // =============================================================================
  // > PROTECTED FUNCTIONS: 
  // =============================================================================
  removeTrailingWhiteSpaceFromLine = (range) => {
    const whitespacePos = LineUtil.findTrailingWhiteSpaceString(this.getText(range));
    if (whitespacePos >= 0) {
      const textLineLength = this.getText(range).length;
      return {
        range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
      };
    }
    return;
  };
  removeMultipleWhitespaceFromLine = (range) => {
    const lineText = this.getText(range);
    if (LineUtil.findMultipleWhiteSpaceString(lineText)) {
      const newLineText = LineUtil.removeMultipleWhiteSpaceString(lineText);
      const startPos = this.getTextLineOrRange(range).firstNonWhitespaceCharacterIndex;
      const endPos = LineUtil.findReverseNonWhitespaceIndex(lineText);
      return {
        range: this.newRangeZeroBased(range.start.line, startPos, endPos),
        string: newLineText
      };
    }
    return;
  };
  removeMulitpleEmptyLines = (range) => {
    const currentLine = this.getTextLineOrRange(range).isEmptyOrWhitespace;
    const nextLine = this.getTextLineOrRange(range, 1).isEmptyOrWhitespace;
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
    const currentLine = this.getTextLineOrRange(range).isEmptyOrWhitespace;
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
var ActiveEditor = class {
  #documentSnapshot;
  #editor;
  line;
  constructor() {
    this.line = new Line();
    this.#editor = vscode3.window.activeTextEditor;
    if (this.#editor) {
      this.#documentSnapshot = this.#editor.document.getText();
    } else {
      return;
    }
  }
  // =============================================================================
  // > RPOTECED FUNCTIONS: 
  // =============================================================================
  snapshotDocument = () => {
    this.#documentSnapshot = vscode3.window.activeTextEditor?.document.getText();
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  prepareEdit = (callback, includeCursorLine) => {
    const editSchedule = [];
    let selections = this.#editor?.selections;
    if (selections?.length === 1) {
      editSchedule.push(...this.line.prepareLines(this.#editor, selections[0], callback));
    } else {
      selections?.forEach((range) => {
        editSchedule.push(...this.line.prepareLines(this.#editor, range, callback));
      });
    }
    this.editInRange(editSchedule);
  };
  editInRange = async (lineCallback) => {
    try {
      const success = await this.#editor?.edit((editBuilder) => {
        lineCallback.forEach((edit) => {
          if (edit !== void 0) {
            switch (edit.type) {
              case 1 /* APPEND */:
                editBuilder.insert(edit.range.start, edit.string ?? "");
                break;
              case 2 /* PREPEND */:
                break;
              case 4 /* REPLACE */:
                editBuilder.replace(edit.range, edit.string ?? "");
                break;
              case 8 /* CLEAR */:
                break;
              case 32 /* DELETE */:
                editBuilder.delete(edit.range);
                break;
              default:
            }
          }
        });
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
  CommandId2[CommandId2["removeTrailingWhitespaceFromSelection"] = 1 /* DEFAULT */ + 4 /* SINGLE_LINE_ONLY_ALLOWED */ + 8 /* EMPTY_LINE_ALLOWED */ + 2 /* CURSOR_ONLY_ALLOWED */] = "removeTrailingWhitespaceFromSelection";
  CommandId2[CommandId2["removeMulitpleEmptyLinesFromSelection"] = void 0] = "removeMulitpleEmptyLinesFromSelection";
  CommandId2[CommandId2["removeEmptyLinesFromSelection"] = void 0] = "removeEmptyLinesFromSelection";
  CommandId2[CommandId2["removeMultipleWhitespaceFromSelection"] = void 0] = "removeMultipleWhitespaceFromSelection";
  CommandId2[CommandId2["removeCommentedTextFromSelection"] = void 0] = "removeCommentedTextFromSelection";
  CommandId2[CommandId2["cleanUpWhitespaceFromSelection"] = void 0] = "cleanUpWhitespaceFromSelection";
  CommandId2[CommandId2["printNowDateTimeOnSelection"] = void 0] = "printNowDateTimeOnSelection";
  return CommandId2;
})(CommandId || {});
var Command = class extends ActiveEditor {
  constructor() {
    super();
  }
  // =============================================================================
  // > PRIVATE VARIABLES: 
  // =============================================================================
  #removeTrailingWhiteSpaceFromLine = {
    func: this.line.removeTrailingWhiteSpaceFromLine,
    type: 32 /* DELETE */
  };
  #removeMultipleWhitespaceFromLine = {
    func: this.line.removeMultipleWhitespaceFromLine,
    type: 4 /* REPLACE */
  };
  #removeMulitpleEmptyLines = {
    func: this.line.removeMulitpleEmptyLines,
    type: 32 /* DELETE */
  };
  #removeCommentedTextFromLine = {
    func: this.line.removeCommentedLine,
    type: 32 /* DELETE */
  };
  #removeEmptyLinesFromLine = {
    func: this.line.removeEmptyLines,
    type: 32 /* DELETE */
  };
  #setNowDateTimeOnLineOnLine = {
    func: this.line.setNowDateTimeOnLine,
    type: 1 /* APPEND */
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  removeTrailingWhitespaceFromSelection = (editor, edit, args) => {
    this.prepareEdit(
      [
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeMulitpleEmptyLinesFromSelection = () => {
    this.prepareEdit(
      [
        this.#removeMulitpleEmptyLines,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeEmptyLinesFromSelection = () => {
    this.prepareEdit(
      [
        this.#removeEmptyLinesFromLine,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeMultipleWhitespace = () => {
    this.prepareEdit(
      [
        this.#removeMultipleWhitespaceFromLine,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  removeCommentedTextFromSelection = () => {
    this.prepareEdit(
      [
        this.#removeCommentedTextFromLine
      ],
      false
    );
  };
  cleanUpWhitespaceFromSelection = () => {
    this.prepareEdit(
      [
        this.#removeTrailingWhiteSpaceFromLine,
        this.#removeMultipleWhitespaceFromLine,
        this.#removeMulitpleEmptyLines
      ],
      false
    );
  };
  printNowDateTimeOnSelection = () => {
    this.prepareEdit(
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
  const disposable = [];
  const command = new Command();
  disposable.push(
    ...Object.keys(CommandId).filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key)).map((key) => {
      if (key in command) {
        return vscode4.commands.registerTextEditorCommand("deco." + key, (editor, edit) => {
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
