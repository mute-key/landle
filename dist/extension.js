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
var getNowDateTimeStamp = () => {
  return (/* @__PURE__ */ new Date()).toLocaleString();
};
var removeTrailingWhiteSpaceString = (line) => line.replace(/[ \t]+$/, "");
var removeMultipleWhiteSpaceString = (line) => line.replace(/\s\s+/g, " ");
var findMultipleWhiteSpaceString = (line) => line.search(/\s\s+/g) !== -1;
function splitStringOn(slicable, ...indices) {
  return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
}

// src/editor/Line.ts
var Line = class {
  #doc;
  #edit;
  constructor() {
  }
  // =============================================================================
  // > PRIVATE FUNCTIONS: 
  // =============================================================================
  /**
   * LineNumbers and 
   * 
   * @param range 
   * @param callback 
   */
  // private iterateLines = (range: vscode.Range, callback: (range : vscode.Range) => void): void => {
  //     let cursor = range.start.line;
  //     while (cursor < range.end.line) {
  //         if (this.#doc.validateRange(range)) {
  //             callback(this.#doc.lineAt(cursor).range);
  //         } 
  //         cursor++;
  //     }
  // };
  // private interateSelections = (callback : (range : vscode.Range) => void): void => {
  //     this.editor?.selections.forEach((range) => {
  //         if (range.isSingleLine) {
  //             callback(range);
  //         } else {
  //             this.iterateLines(range, callback);
  //         };
  //     });
  // };
  // private interateSelectionOnly = (callback : (range : vscode.Range) => void): void => {
  //     this.editor?.selections.forEach((range) => {
  //         callback(range);
  //     });
  // };
  // need to revise if this is actually needed
  lineRange = (range) => {
    return this.#doc.lineAt(range.start.line).range;
  };
  lineRangeWithEOL = (range) => {
    return this.#doc.lineAt(range.start.line).rangeIncludingLineBreak;
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
    this.deleteRange(this.lineRange(range));
  };
  removeLine = (range) => {
    this.deleteRange(this.lineRangeWithEOL(range));
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
  removeTrailingWhiteSpaceFromLine = (range) => {
    const newRange = this.getLineFullRange(range);
    const newLine = removeTrailingWhiteSpaceString(this.getText(this.getLineFullRange(range)));
    this.setLine(newRange, newLine);
  };
  removeMulitpleEmptyLines = (range) => {
    this.checkNextLine(range, this.removeLine);
  };
  removeEmptyLines = (range) => {
    if (this.ifLineIsEmpty(this.getTextLine(range))) {
      this.removeLine(range);
    }
  };
  removeMultipleWhitespaceFromLine = (range) => {
    const textLine = this.getTextLine(range);
    const findex = textLine.firstNonWhitespaceCharacterIndex;
    if (findMultipleWhiteSpaceString(textLine.text)) {
      let text = splitStringOn(this.getText(range), findex);
      if (Array.isArray(text) && text.length > 1) {
        this.setLine(range, text[0] + removeMultipleWhiteSpaceString(text[1]));
      }
    }
  };
  cleanUpWhitespaceFromLines = (range) => {
  };
  setNowDateTimeOnLine = (range) => {
    this.prepend(range, getNowDateTimeStamp());
  };
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

// src/editor/LineSelection.ts
var LineSelection = class extends Line {
  constructor() {
    super();
  }
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  removeTrailingWhitespaceFromSelection = () => {
    console.log("command removeTrailingWhitespaceFromSelection");
  };
  removeMulitpleEmptyLinesFromSelection = () => {
  };
  removeEmptyLinesFromSelection = () => {
  };
  removeMultipleWhitespace = () => {
  };
  cleanUpWhitespace = () => {
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

// src/editor/ActiveEditor.ts
var ActiveEditor = class extends LineSelection {
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
  // protected currentSelection = (() : vscode.Selection[] => <vscode.Selection[]>vscode.window.activeTextEditor?.selections)();
  validateChange = (newDocumentText) => this.#documentSnapshot === newDocumentText;
  snapshotDocument = () => {
    this.#documentSnapshot = vscode3.window.activeTextEditor?.document.getText();
  };
  // protected doEdit = (callback): vscode.ProviderResult<typeof callback> => {
  // };
  prepareEditRange = (range, editType) => {
  };
  editInRange = async (editor, range) => {
    const edit = new vscode3.WorkspaceEdit();
    await vscode3.workspace.applyEdit(edit);
    this.snapshotDocument();
  };
  // public applyEdit = async () => {
  //     return this.editor?.edit((editBuilder) => {
  //         // editBuilder.
  //         // this.#edit = editBuilder;
  //         // this.interateSelections(callback);
  //     });
  // };
};

// src/register.ts
var CommandId = /* @__PURE__ */ ((CommandId2) => {
  CommandId2[CommandId2["removeTrailingWhitespaceFromSelection"] = 0] = "removeTrailingWhitespaceFromSelection";
  CommandId2[CommandId2["removeMulitpleEmptyLinesFromSelection"] = 1] = "removeMulitpleEmptyLinesFromSelection";
  CommandId2[CommandId2["removeEmptyLinesFromSelection"] = 2] = "removeEmptyLinesFromSelection";
  CommandId2[CommandId2["removeMultipleWhitespace"] = 3] = "removeMultipleWhitespace";
  CommandId2[CommandId2["cleanUpWhitespace"] = 4] = "cleanUpWhitespace";
  CommandId2[CommandId2["printNowDateTime"] = 5] = "printNowDateTime";
  CommandId2[CommandId2["test"] = 6] = "test";
  return CommandId2;
})(CommandId || {});
var Register = (context, handleLocal = true) => {
  const disposable = [];
  const activeEditor = new ActiveEditor();
  disposable.push(
    ...Object.keys(CommandId).filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key)).map((key) => {
      if (key in activeEditor) {
        return vscode4.commands.registerTextEditorCommand("deco." + key, activeEditor[key]);
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
