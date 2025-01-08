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
  LineUtil2.removeMultipleWhiteSpaceString = (line) => line.replace(/\s\s+/g, " ");
  LineUtil2.getMultipleWhiteSpaceString = (line) => line.match(/(?<=\S)\s+(?=\S)/g);
  LineUtil2.findMultipleWhiteSpaceString = (line) => line.search(/(?<=\S)\s+(?=\S)/g) !== -1;
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
  getTextLineOrRange = (range, offset = 0) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range + offset);
    }
    return this.#doc.lineAt(range.start.line + offset);
  };
  lineFullRange = (range) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range).range;
    }
    return this.#doc.lineAt(range.start.line).range;
  };
  lineFullRangeWithEOL = (range) => {
    return this.#doc.lineAt(range.start.line).rangeIncludingLineBreak;
  };
  /**
   * LineNumbers and 
   * 
   * @param range 
   * @param callback 
   */
  // Promise<string>[]
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
      if (!Array.isArray(callback)) {
        const newLineObject = callback.func(this.lineFullRange(currentLineNumber));
        if (newLineObject !== void 0) {
          editList.push({
            ...newLineObject,
            type: callback.type
          });
        }
      } else {
        let refreshRange = this.lineFullRange(currentLineNumber);
        callback.forEach((fnPerLine) => {
          const line = fnPerLine.func(refreshRange);
          if (line) {
            editList.push({
              ...line,
              type: fnPerLine.type
            });
            refreshRange = this.lineFullRange(currentLineNumber);
          }
        });
      }
      currentLineNumber++;
    }
    return editList;
  };
  deleteRange = (range) => {
    return this.#edit.delete(range);
  };
  getText = (range) => {
    return this.#doc.getText(range);
  };
  getTextLine = (range, offset = 0) => {
    return this.#doc.lineAt(range.start.line + offset);
  };
  clearLine = (range) => {
    this.deleteRange(this.lineFullRange(range));
  };
  removeLine = (range) => {
    this.deleteRange(this.lineFullRangeWithEOL(range));
  };
  ifLineIsEmpty = (textLine) => textLine.isEmptyOrWhitespace;
  checkNextLine = (range, callback) => {
    const currentLine = this.getTextLine(range);
    const nextLine = this.getTextLine(range, 1);
    if (this.ifLineIsEmpty(currentLine) && this.ifLineIsEmpty(nextLine)) {
      callback(this.getTextLine(range).range);
    }
  };
  getLineNumbersFromRange = (range) => {
    const startLine = range.start.line;
    const endLine = range.end.line;
    return { startLine, endLine };
  };
  Indent = () => {
  };
  Append = (add) => {
  };
  prepend = (range, insert) => {
    this.#edit.insert(range.start, insert);
  };
  getLineFullRange = (range) => {
    const currentRange = this.getLineNumbersFromRange(range);
    return this.#doc.lineAt(currentRange.startLine).range;
  };
  setLine = (range, line) => {
    console.log(line);
    const currentRange = this.getLineNumbersFromRange(range);
    const currentLineFullRange = this.#doc.lineAt(currentRange.startLine).range;
    this.#edit.replace(currentLineFullRange, line);
  };
  // need range pass types. lets use bitmask.
  // 
  rangeHandler = (range) => {
    if (range.isEmpty) {
      return this.getLineFullRange(range);
    } else {
    }
    return range;
  };
  // =============================================================================
  // > PROTECTED FUNCTIONS: 
  // =============================================================================
  // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {
  //     return this.editor?.edit((editBuilder) => {
  //         this.#edit = editBuilder;
  //         this.interateSelections(callback);
  //     });
  // };
  // protected perSelectionEdit = (callback): vscode.ProviderResult<typeof callback> => {
  //     return this.editor?.edit((edit) => {
  //         this.#edit = edit;
  //         this.interateSelections(callback);
  //     });
  // };
  newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
    return new vscode2.Range(
      new vscode2.Position(lineNuber, startPosition),
      new vscode2.Position(lineNuber, endPosition)
    );
  };
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
      console.log("newLineText", newLineText);
      return {
        range: this.newRangeZeroBased(range.start.line, 0, newLineText.length - 1),
        string: newLineText.trim()
      };
    }
    return;
  };
  removeMulitpleEmptyLines = (range) => {
    this.checkNextLine(range, this.removeLine);
  };
  removeEmptyLines = (range) => {
    if (this.ifLineIsEmpty(this.getTextLine(range))) {
      this.removeLine(range);
    }
  };
  cleanUpWhitespaceFromLines = (range) => {
  };
  // protected setNowDateTimeOnLine = (range : vscode.Range) : void => {
  //     this.prepend(range, getNowDateTimeStamp());
  // };
  /**
   * 
   * i will not implement something that formatter already can do
   * 
   * 
   * - need to check if selection is multiple lines if then, do.
   * - check the language of the current editor 
   * - if selected range is commented, join them 
   * - if selected rnage is not comment, ignore 
   * - if selection is plan text, just join them 
   * - rmeove all multiple line spaces when join  
   * 
   * @param range 
   */
  joinLines = (range) => {
    const langId = vscode2.window.activeTextEditor?.document.languageId;
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
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
  // protected currentSelection = (() : vscode.Selection[] => <vscode.Selection[]>vscode.window.activeTextEditor?.selections)();
  validateChange = (newDocumentText) => this.#documentSnapshot === newDocumentText;
  snapshotDocument = () => {
    this.#documentSnapshot = vscode3.window.activeTextEditor?.document.getText();
  };
  // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {
  // };
  /**
   * 
   * @param callback 
   */
  prepareEdit = (callback, includeCursorLine) => {
    let selections = this.#editor?.selections;
    const editSchedule = [];
    if (selections?.length === 1) {
      const nl = this.line.prepareLines(this.#editor, selections[0], callback);
      editSchedule.push(...nl);
      this.editInRange(editSchedule);
    } else {
      selections?.forEach((range) => {
        editSchedule.push(...this.line.prepareLines(this.#editor, range, callback));
      });
      console.log(editSchedule);
      this.editInRange(editSchedule);
    }
  };
  editInRange = async (lineCallback) => {
    try {
      const success = await this.#editor?.edit((editBuilder) => {
        lineCallback.forEach((edit) => {
          if (edit !== void 0) {
            switch (edit.type) {
              case 1 /* APPEND */:
                break;
              case 2 /* PREPEND */:
                break;
              case 4 /* REPLACE */:
                editBuilder.delete(this.line.lineFullRange(edit.range));
                editBuilder.insert(edit.range.start, edit.string ?? "????");
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
  // public applyEdit = async () => {
  //     return this.editor?.edit((editBuilder) => {
  //         // editBuilder.
  //         // this.#edit = editBuilder;
  //         // this.interateSelections(callback);
  //     });
  // };
};

// src/command.ts
var CommandId = ((CommandId2) => {
  CommandId2[CommandId2["removeTrailingWhitespaceFromSelection"] = 1 /* DEFAULT */ + 4 /* SINGLE_LINE_ONLY_ALLOWED */ + 8 /* EMPTY_LINE_ALLOWED */ + 2 /* CURSOR_ONLY_ALLOWED */] = "removeTrailingWhitespaceFromSelection";
  CommandId2[CommandId2["removeMulitpleEmptyLinesFromSelection"] = void 0] = "removeMulitpleEmptyLinesFromSelection";
  CommandId2[CommandId2["removeEmptyLinesFromSelection"] = void 0] = "removeEmptyLinesFromSelection";
  CommandId2[CommandId2["removeMultipleWhitespace"] = void 0] = "removeMultipleWhitespace";
  CommandId2[CommandId2["cleanUpWhitespace"] = void 0] = "cleanUpWhitespace";
  CommandId2[CommandId2["printNowDateTime"] = void 0] = "printNowDateTime";
  CommandId2[CommandId2["test"] = void 0] = "test";
  return CommandId2;
})(CommandId || {});
var Command = class extends ActiveEditor {
  constructor() {
    super();
  }
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  removeTrailingWhitespaceFromSelection = (editor, edit, args) => {
    this.snapshotDocument();
    this.prepareEdit(
      {
        func: this.line.removeTrailingWhiteSpaceFromLine,
        type: 32 /* DELETE */
      },
      false
    );
  };
  removeMulitpleEmptyLinesFromSelection = () => {
  };
  removeEmptyLinesFromSelection = () => {
  };
  removeMultipleWhitespace = () => {
    this.snapshotDocument();
    this.prepareEdit(
      [
        {
          func: this.line.removeMultipleWhitespaceFromLine,
          type: 4 /* REPLACE */
        }
      ],
      false
    );
  };
  cleanUpWhitespace = () => {
    this.snapshotDocument();
    this.prepareEdit(
      [
        {
          func: this.line.removeMultipleWhitespaceFromLine,
          type: 4 /* REPLACE */
        }
      ],
      false
    );
  };
  printNowDateTime = () => {
  };
  // public joinMultipleLines = () => {
  //     this.editorEdit(this.joinLines);
  // };
  // public joinCommnetLines = () => {
  //     this.editorEdit(this.joinLines);
  // };
  repaceTabWithSpace = () => {
  };
  // private removeTrailingEmptyLines() {
  // }
  // private interateSelection = (selection , callback) => {};
  // public removeAllSelectedWhitespaceLines = () => {
  //     this.editorEdit(this.removeLine);
  // };
  // public justfityAlign() {
  // }
  // public cleanWhiteSpaceLines = () => {
  //     this.editor?.selections.forEach((range) => {
  //         if (range.isSingleLine) {
  //             // range
  //             // if ()
  //             // check if line is empty 
  //             // this.removeLine(range);
  //         } else {
  //             // range.start
  //             // this.removeMultipleLine(range);
  //         }
  //         // this.clearLine(range);
  //     });
  // };
  // public cleanMultipleWhiteSpaceLines = () => {
  //     this.editor?.selections.forEach((range) => {
  //         if (range.isSingleLine) {
  //             // this.removeLine(range);
  //         } else {
  //             // range.start
  //             // this.removeMultipleLine(range);
  //         }
  //         // this.clearLine(range);
  //     });
  // };
  // public removeAllSelectedLines = () => {
  //     // ctrl + alt + k 
  //     // console.log('removeAllSelectedLines');
  //     // // this.editor?.selections.;
  //     // this.editor?.selections.forEach((range) => {
  //     //     if (range.isSingleLine) {
  //     //         this.removeLine(range);
  //     //     } else {
  //     //         // range.start
  //     //         // this.removeMultipleLine(range);
  //     //     }
  //     // });
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
