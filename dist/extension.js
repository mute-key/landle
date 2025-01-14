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
var vscode5 = __toESM(require("vscode"));

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
  activationEvents: [
    "onStartupFinished"
  ],
  main: "./dist/extension.js",
  contributes: {
    commands: [
      {
        command: "lindle.removeTrailingWhitespaceFromSelection",
        title: "Remove Trailing Whitespace From Selection"
      },
      {
        command: "lindle.removeMulitpleEmptyLinesFromSelection",
        title: "Remove Mulitple Empty Lines From Selection"
      },
      {
        command: "lindle.removeEmptyLinesFromSelection",
        title: "Remove Empty Lines From Selection"
      },
      {
        command: "lindle.removeMultipleWhitespaceFromSelection",
        title: "Remove Multiple Whitespace From Selection"
      },
      {
        command: "lindle.removeCommentedTextFromSelection",
        title: "Remove Commented Text From Selection"
      },
      {
        command: "lindle.removeDuplicateLineFromSelection",
        title: "Remove Duplicate Line From Selection"
      },
      {
        command: "lindle.cleanUpBlockCommentFromSelection",
        title: "clean-up Block Comment From Selection"
      },
      {
        command: "lindle.cleanUpWhitespaceFromSelection",
        title: "Clean-up Whitespace From Selection"
      },
      {
        command: "lindle.printNowDateTimeOnSelection",
        title: "Print Now DateTime On Selection"
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
        command: "lindle.removeDuplicateLineFromSelection",
        key: "ctrl+alt+d"
      },
      {
        command: "lindle.cleanUpBlockCommentFromSelection",
        key: "ctrl+alt+b"
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
var vscode4 = __toESM(require("vscode"));

// src/editor/Line.ts
var vscode = __toESM(require("vscode"));
var LineType;
((LineType2) => {
  let LineEditCollisionGroup;
  ((LineEditCollisionGroup2) => {
    LineEditCollisionGroup2[LineEditCollisionGroup2["DEFAULT"] = 0] = "DEFAULT";
    LineEditCollisionGroup2[LineEditCollisionGroup2["NO_RANGE_OVERLAPPING"] = 1] = "NO_RANGE_OVERLAPPING";
    LineEditCollisionGroup2[LineEditCollisionGroup2["IGNORE_ON_COLLISION"] = 2] = "IGNORE_ON_COLLISION";
    LineEditCollisionGroup2[LineEditCollisionGroup2["PRIORITY"] = 4] = "PRIORITY";
  })(LineEditCollisionGroup = LineType2.LineEditCollisionGroup || (LineType2.LineEditCollisionGroup = {}));
  let LineEditType;
  ((LineEditType2) => {
    LineEditType2[LineEditType2["APPEND"] = 1] = "APPEND";
    LineEditType2[LineEditType2["PREPEND"] = 2] = "PREPEND";
    LineEditType2[LineEditType2["REPLACE"] = 4] = "REPLACE";
    LineEditType2[LineEditType2["CLEAR"] = 8] = "CLEAR";
    LineEditType2[LineEditType2["DELETE"] = 32] = "DELETE";
  })(LineEditType = LineType2.LineEditType || (LineType2.LineEditType = {}));
  ;
})(LineType || (LineType = {}));
var Line = class {
  #doc;
  #editor;
  constructor() {
    this.#editor = vscode.window.activeTextEditor;
    if (!this.#editor) {
      console.error("No Active Editor");
      return;
    } else {
      this.#doc = this.#editor.document;
    }
  }
  // =============================================================================
  // > PRIVATE FUNCTIONS: 
  // =============================================================================
  /**
   * unused. for future reference. 
   * 
   * @param range unused
   * @returns unused
   */
  #getLineNumbersFromRange = (range) => {
    const startLine = range.start.line;
    const endLine = range.end.line;
    return { startLine, endLine };
  };
  /**
   * unused. for future reference. 
   * 
   * @param range unused
   * @returns unused
   */
  #editLineBindOnCondition = (range, callback, cond) => {
    return cond ? {
      ...callback.func(this.lineFullRange(range)),
      type: callback.type
    } : void 0;
  };
  /**
   * this private function is a wrap and shape the return object for each callback for a line. 
   * the function will take current range with callback and execute to get the information 
   * how to edit the line, which described in object with type of LineEditInfo. 
   * this is where the default blocking value will be set to block additional edit on line;
   * default for blocking the edit is true, and it is false if it is not defined in callback object. 
   * this means that only a function with block:true will be executed and every other callbacks 
   * will be drop for the further.
   * 
   * @param currntRange 
   * @param fn 
   * @param _lineEdit_ 
   * @returns LineType.LineEditInfo | undefined
   */
  #editedLineInfo = (currntRange, fn) => {
    const editInfo = fn.func(currntRange);
    if (editInfo) {
      if (editInfo.type) {
        return {
          range: editInfo.range,
          string: editInfo?.string,
          type: editInfo.type ? editInfo.type : fn.type,
          block: fn.block ? true : false,
          lineSkip: editInfo.lineSkip
        };
      } else {
        return {
          ...editInfo,
          type: fn.type,
          block: fn.block ? true : false
        };
      }
    }
  };
  /**
   * this is the mian loop to iterate the callbacks that are defined from command class.
   * there is a object key named block. when the property block is true, it will drop all the 
   * added edit, and assign itself and stops further iteration to prevent no more changes to be
   * applied to that line. when the for loop is finished, it will be stacked into _line_edit_ refernce 
   * and goes into next iteration. 
   * 
   * this iteration could well have been done in array.reduce but it does unnecessary exection in the iteartion.
   * so thats why it is for loop. 
   * 
   * @param range 
   * 
   * @param callback 
   * @returns 
   * 
   */
  #callbackIteration = (range, callback) => {
    let currentLineEdit = [];
    for (const fn of callback) {
      const result = this.#editedLineInfo(range, fn);
      if (result) {
        if (fn.block === true) {
          currentLineEdit = [result];
          break;
        } else {
          currentLineEdit.push(result);
        }
      }
    }
    return currentLineEdit;
  };
  /**
   * this funciton will iterate each line and stack the line edit object.
   * iteration will continue unitl the current line number is less than less than line number of
   * the each selection. the range at this point of execution will represent a single range and 
   * not entire document. callback will be a list of callbacks to check/apply to each line. 
   * _lineEdit_ variable are being used as a references so no direct assignement becuase 
   * the variable is what this function will return upon the end of the iteration. 
   * 
   * there is a for loop that will iterate each every callback. the problem with js array api is 
   * it lacks handling the undefined value being returned in single api functions rather, 
   * you have to chain them. using array api in callback object (becuase it is what it needs to 
   * iterate on), the type-mismatch forces to return either a typed object or undefined becasuse 
   * the callback will have a return type. this means the reseult of the iteration will contain undefiend 
   * item if callback returns undefined; and it makes to iterate twice to filter them for each every line. 
   * further explanation continues in function #editedLineInfo. 
   * 
   * @param range 
   * @param callback 
   * @param currentLineNumber 
   * @param _lineEdit_ 
   * @returns IterateLineType[]
   */
  #lineIteration = (range, callback, currentLineNumber, _lineEdit_, lineSkip) => {
    lineSkip = lineSkip ?? /* @__PURE__ */ new Set();
    while (currentLineNumber <= range.end.line) {
      if (lineSkip.has(currentLineNumber)) {
        currentLineNumber++;
        continue;
      }
      const currentLineEdit = this.#callbackIteration(this.lineFullRange(currentLineNumber), callback);
      if (currentLineEdit.length > 0) {
        if (currentLineEdit[0].lineSkip) {
          currentLineEdit[0].lineSkip.forEach((line) => lineSkip.add(line));
        }
        _lineEdit_.push(...currentLineEdit);
      }
      currentLineNumber++;
    }
    return _lineEdit_;
  };
  // =============================================================================
  // > PROTECTED FUNCTIONS: 
  // =============================================================================
  /**
   * get EOL of current document set
   * 
   * @returns 
   */
  getEndofLine = () => this.#editor?.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
  /**
   * get text as string from range
   * 
   * @param range target range
   * @returns text as string
   */
  getText = (range) => {
    return this.#doc.getText(range);
  };
  /**
   * get TextLine object from range or from line number. 
   * 
   * @param range target range
   * @returns TextLine object of range or line.
   */
  getTextLineFromRange = (range, lineDelta = 0) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range + lineDelta);
    }
    if (range.start.line + lineDelta < 0) {
      return this.#doc.lineAt(range.start.line);
    }
    if (this.#doc.lineCount > range.start.line + lineDelta) {
      return this.#doc.lineAt(range.start.line + lineDelta);
    }
    return this.#doc.lineAt(range.start.line);
  };
  /**
   * get the range of entire line including EOL.
   * 
   * @param range target range
   * @returns 
   */
  lineFullRangeWithEOL = (range) => {
    return this.getTextLineFromRange(range).rangeIncludingLineBreak;
  };
  /**
   * create new range with line number, starting position and end position
   * 
   * @param lineNuber line number of new range object
   * @param startPosition starting position of range
   * @param endPosition end position of range
   * @returns 
   */
  newRangeZeroBased = (lineNuber, startPosition, endPosition) => {
    return new vscode.Range(
      new vscode.Position(lineNuber, startPosition),
      new vscode.Position(lineNuber, endPosition)
    );
  };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  /**
   * get the range of line with any characters including whitespaces. 
   * 
   * @param range vscode.Range | number. 
   * @returns first line of the range or whole line of the the line number.
   */
  lineFullRange = (range) => {
    if (typeof range === "number") {
      return this.#doc.lineAt(range).range;
    }
    return this.#doc.lineAt(range.start.line).range;
  };
  /**
   * take range as a single selection that could be a single line, empty (cursor only) 
   * or mulitple lines. the callback will be defined in Command.ts. this function will return 
   * either a single LineEditInfo or array of them to schedule the document edit. 
   * if the selection is either of empty (whitespaces only) or a single line, the 
   * range should be the whole line. 
   * 
   * @param range 
   * @param callback 
   * @returns 
   */
  prepareLines = (range, callback) => {
    const targetLine = range.start.line;
    if (range.isEmpty || range.isSingleLine) {
      return this.#callbackIteration(this.lineFullRange(targetLine), callback);
    }
    return this.#lineIteration(
      range,
      callback,
      targetLine,
      []
    );
  };
};

// src/editor/LineHandler.ts
var vscode3 = __toESM(require("vscode"));

// src/common/LineUtil.ts
var vscode2 = __toESM(require("vscode"));
var LineUtil = class {
  // #rmTrailingWhiteSpaceString = /[ \t]+$/;
  // #ifTrailingWhiteSpaceString = /\s(?=\s*$)/g;
  // #ifNonWhitespaceIndex = /\S/g;
  // #ifNonWhitespaceIndexReverse = /\S(?=\s*$)/g;
  // #rmMultipleWhiteSpaceString = /\s\s+/g;
  // #ifMultipleWhiteSpaceString = /(?<=\S)\s+(?=\S)/g;
  // #isCommented = /^\s*\/\//g;
  constructor() {
  }
  static removeTrailingWhiteSpaceString = (line) => line.replace(/[ \t]+$/, " ");
  static findTrailingWhiteSpaceString = (line) => line.search(/\s(?=\s*$)/g);
  static findNonWhitespaceIndex = (line) => line.search(/\S/g);
  static findReverseNonWhitespaceIndex = (line) => line.search(/\S(?=\s*$)/g);
  static removeMultipleWhiteSpaceString = (line) => line.replace(/\s\s+/g, " ");
  static findMultipleWhiteSpaceString = (line) => line.search(/(?<=\S)\s+\s(?=\S)/) !== -1;
  static isLineCommented = (line) => line.search(/^\s*\/\//g) !== -1;
  static isEmptyBlockComment = (line) => line.search(/^\s*\*\s*$/s) !== -1;
  static isBlockComment = (line) => line.search(/^\s*\*+\s+\S+/s) !== -1;
  static isBlockCommentStartingLine = (line) => line.search(/^\s*\/.*\s*$/) !== -1;
  static isBlockCommentEndingLine = (line) => line.search(/^\s*\*\//) !== -1;
  static cleanBlockComment = (line) => line.replace(/(?<=\*).*/, "");
  static pushMessage = (message) => {
    return vscode2.window.showInformationMessage(message);
  };
  static splitStringOn(slicable, ...indices) {
    return [0, ...indices].map((n, i, m) => slicable.slice(n, m[i + 1]));
  }
  static getNowDateTimeStamp = /* @__PURE__ */ (() => ({
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
};

// src/editor/LineHandler.ts
var LineHandler = class extends Line {
  constructor() {
    super();
  }
  /**
   * remove trailing whitespace lines from range if there is non-whitespace-character present. 
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   */
  removeTrailingWhiteSpace = (range) => {
    const textString = this.getText(range);
    const whitespacePos = LineUtil.findTrailingWhiteSpaceString(textString);
    if (whitespacePos >= 0) {
      const textLineLength = textString.length;
      return {
        range: this.newRangeZeroBased(range.start.line, whitespacePos, textLineLength)
      };
    }
    return;
  };
  /**
   * remove continous whitespaces that are longer than 1 from line when there is non-whitespace
   * -character present in line. this will ignore indentation and edtiing range will start from 
   * fisrt non whitespace character in the line. this funciton will keep the pre-edit range 
   * to overwrite with whitespaces otherwise pre-edit characters will be left in the line 
   * otherwise this callback would need to perform 2 edit to achieve removing the whitespaces in
   * delta bigger than 1. resizing range will only affact to target range but not out or range.
   *  
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   */
  removeMultipleWhitespace = (range) => {
    const lineText = this.getText(range);
    if (LineUtil.findMultipleWhiteSpaceString(lineText) && !this.getTextLineFromRange(range).isEmptyOrWhitespace) {
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
  /**
   * check if the current cursor or selected range is empty line and next. 
   * if both current and next is emtpy, remove current line. 
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   */
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
  /**
   * remove line if the line is commented
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   */
  removeCommentedLine = (range) => {
    const lineText = this.getText(range);
    if (LineUtil.isLineCommented(lineText)) {
      return {
        range: this.lineFullRangeWithEOL(range)
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
  removeEmptyLine = (range) => {
    const currentLine = this.getTextLineFromRange(range).isEmptyOrWhitespace;
    if (currentLine) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  /**
   * check if the current cursor or selected range is empty line and next. 
   * if both current and next is emtpy, remove current line. 
   * 
   * @param range target range
   * @returns object descripting where/how to edit the line or undefined if no condition is met.
   * 
   */
  removeDuplicateLine = (range) => {
    const currentLine = this.getTextLineFromRange(range);
    const nextLine = this.getTextLineFromRange(range, 1);
    if (currentLine.text === nextLine.text) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  removeEmptyBlockCommentLineOnStart = (range) => {
    const currentLine = this.getTextLineFromRange(range);
    const beforeLine = this.getTextLineFromRange(range, -1);
    const blockCommentStart = LineUtil.isBlockCommentStartingLine(beforeLine.text);
    const nextLine = this.getTextLineFromRange(range, 1);
    if (blockCommentStart && LineUtil.isEmptyBlockComment(currentLine.text)) {
      let ln = range.start.line;
      let rg = void 0;
      let tl;
      const lineSkip = [];
      while (ln) {
        tl = this.getTextLineFromRange(ln);
        if (LineUtil.isEmptyBlockComment(tl.text)) {
          rg = tl.range;
          lineSkip.push(ln);
        } else {
          break;
        }
        ln++;
      }
      if (rg) {
        return {
          range: new vscode3.Range(
            new vscode3.Position(range.start.line, 0),
            new vscode3.Position(rg.start.line + 1, 0)
          ),
          lineSkip
        };
      }
    }
    return;
  };
  removeMultipleEmptyBlockCommentLine = (range) => {
    const currentLine = this.getTextLineFromRange(range);
    const nextLine = this.getTextLineFromRange(range, 1);
    const nextLineIsBlockCommend = LineUtil.isEmptyBlockComment(nextLine.text);
    const LineIsBlockCommend = LineUtil.isEmptyBlockComment(currentLine.text);
    if (LineIsBlockCommend && nextLineIsBlockCommend) {
      return {
        range: this.lineFullRangeWithEOL(range)
      };
    }
    return;
  };
  insertEmptyBlockCommentLineOnEnd = (range) => {
    const EOL = this.getEndofLine();
    const currentLine = this.getTextLineFromRange(range);
    const nextLine = this.getTextLineFromRange(range, 1);
    const NextLineblockCommentEnd = LineUtil.isBlockCommentEndingLine(nextLine.text);
    if (NextLineblockCommentEnd && LineUtil.isBlockComment(currentLine.text)) {
      return {
        range: this.newRangeZeroBased(range.start.line, currentLine.text.length, currentLine.text.length),
        string: EOL + LineUtil.cleanBlockComment(currentLine.text) + " ",
        type: LineType.LineEditType.APPEND
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
   */
  setNowDateTimeOnLine = (range) => {
    return {
      range,
      string: LineUtil.getNowDateTimeStamp.custom()
    };
    ;
  };
};

// src/editor/ActiveEditor.ts
var ActiveEditor = class {
  // unused. for future reference.
  #documentSnapshot;
  #editor;
  #lineHandler;
  constructor() {
    this.#setActiveEditor();
    this.#lineHandler = new LineHandler();
  }
  /**
   * get current active text editor
   * @returns 
   */
  #setActiveEditor = () => {
    this.#editor = vscode4.window.activeTextEditor;
    if (this.#editor) {
      this.#documentSnapshot = this.#editor.document.getText();
    } else {
      return;
    }
  };
  /**
   * this function will perform edit with it's given range with string. 
   * 
   * @param edit :LineType.LineEditType will have the;
   * - range
   * - type 
   * - string
   * @param editBuilder as it's type. 
   */
  #editSwitch = (edit, editBuilder) => {
    if (edit) {
      switch (edit.type) {
        case LineType.LineEditType.APPEND:
          editBuilder.insert(edit.range.start, edit.string ?? "");
          break;
        case LineType.LineEditType.CLEAR:
          editBuilder.delete(this.#lineHandler.lineFullRange(edit.range));
          break;
        case LineType.LineEditType.DELETE:
          editBuilder.delete(edit.range);
          break;
        case LineType.LineEditType.REPLACE:
          editBuilder.replace(edit.range, edit.string ?? "");
          break;
        case LineType.LineEditType.PREPEND:
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
    this.#documentSnapshot = vscode4.window.activeTextEditor?.document.getText();
  };
  resetCursor = () => {
  };
  // protected addEmptyLine = () => {
  //     if (this.#editor?.document.lineCount)
  // };
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  /**
   * returns object literal of class linHandler with it's method.
   * @return private instance of lineHandler
   */
  lineHandler = (() => {
    if (this.#lineHandler === void 0) {
      this.#lineHandler = new LineHandler();
    }
    return this.#lineHandler;
  })();
  /**
   * it picks up current editor then, will iterate for each selection range in the 
   * curernt open editor, and stack the callback function references. 
   * each selection could be either; empty or singleline or multiple lines but 
   * they will be handled in the Line class. 
   * 
   * it could have not started to ieterate if the selection is not a multiple line,
   * however then it more conditions need to be checked in this class function. 
   * beside, if choose not to iterate, means, will not use array, the arugment and
   * it's type will not be an array or either explicitly use array with a single entry.
   * that will end up line handling to either recieve array or an single callback 
   * object which is inconsistance. plus, it is better to handle at one execution point 
   * and that would be not here. 
   * 
   * @param callback line edit function and there could be more than one edit required.
   * @param includeCursorLine unused. for future reference. 
   * 
   */
  prepareEdit = (callback, includeCursorLine) => {
    this.#setActiveEditor();
    const editSchedule = [];
    const selections = this.#editor?.selections;
    selections?.forEach((range) => {
      editSchedule.push(...this.#lineHandler.prepareLines(range, callback));
    });
    this.editInRange(editSchedule);
  };
  /**
   * performes aysnc edit and aplit it all at once they are complete. 
   * 
   * @param lineCallback collecion of edits for the document how and where to edit. 
   */
  editInRange = async (lineCallback) => {
    try {
      const success = await this.#editor?.edit((editBuilder) => {
        lineCallback.forEach((edit) => this.#editSwitch(edit, editBuilder));
      }).then((res) => {
        console.log(res);
        this.resetCursor();
      });
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
var EditorCommandId = ((EditorCommandId2) => {
  EditorCommandId2[EditorCommandId2["removeTrailingWhitespaceFromSelection"] = LineType.LineEditCollisionGroup.NO_RANGE_OVERLAPPING + LineType.LineEditCollisionGroup.PRIORITY] = "removeTrailingWhitespaceFromSelection";
  EditorCommandId2[EditorCommandId2["removeMulitpleEmptyLinesFromSelection"] = void 0] = "removeMulitpleEmptyLinesFromSelection";
  EditorCommandId2[EditorCommandId2["removeEmptyLinesFromSelection"] = void 0] = "removeEmptyLinesFromSelection";
  EditorCommandId2[EditorCommandId2["removeMultipleWhitespaceFromSelection"] = LineType.LineEditCollisionGroup.NO_RANGE_OVERLAPPING + LineType.LineEditCollisionGroup.IGNORE_ON_COLLISION] = "removeMultipleWhitespaceFromSelection";
  EditorCommandId2[EditorCommandId2["removeCommentedTextFromSelection"] = void 0] = "removeCommentedTextFromSelection";
  EditorCommandId2[EditorCommandId2["removeDuplicateLineFromSelection"] = void 0] = "removeDuplicateLineFromSelection";
  EditorCommandId2[EditorCommandId2["cleanUpBlockCommentFromSelection"] = void 0] = "cleanUpBlockCommentFromSelection";
  EditorCommandId2[EditorCommandId2["cleanUpWhitespaceFromSelection"] = void 0] = "cleanUpWhitespaceFromSelection";
  EditorCommandId2[EditorCommandId2["printNowDateTimeOnSelection"] = void 0] = "printNowDateTimeOnSelection";
  return EditorCommandId2;
})(EditorCommandId || {});
var Command = class {
  #ActiveEditor;
  // these private variables defines the line function bindings.
  #removeTrailingWhiteSpaceFromLine;
  #removeMultipleWhitespaceFromLine;
  #removeMulitpleEmptyLines;
  #removeCommentedTextFromLines;
  #removeEmptyLines;
  #removeDuplicateLines;
  #removeEmptyBlockCommentLineOnStart;
  #removeMultipleEmptyBlockCommentLine;
  #insertEmptyBlockCommentLineOnEnd;
  // #cleanUpBlockCommentLines;
  #setNowDateTimeOnLineOnLine;
  constructor() {
    this.#ActiveEditor = new ActiveEditor();
    this.#removeTrailingWhiteSpaceFromLine = {
      func: this.#ActiveEditor.lineHandler.removeTrailingWhiteSpace,
      type: LineType.LineEditType.DELETE
    };
    this.#removeMultipleWhitespaceFromLine = {
      func: this.#ActiveEditor.lineHandler.removeMultipleWhitespace,
      type: LineType.LineEditType.REPLACE
    };
    this.#removeMulitpleEmptyLines = {
      func: this.#ActiveEditor.lineHandler.removeMulitpleEmptyLine,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#removeCommentedTextFromLines = {
      func: this.#ActiveEditor.lineHandler.removeCommentedLine,
      type: LineType.LineEditType.DELETE
    };
    this.#removeEmptyLines = {
      func: this.#ActiveEditor.lineHandler.removeEmptyLine,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#removeDuplicateLines = {
      func: this.#ActiveEditor.lineHandler.removeDuplicateLine,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#removeEmptyBlockCommentLineOnStart = {
      func: this.#ActiveEditor.lineHandler.removeEmptyBlockCommentLineOnStart,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#removeMultipleEmptyBlockCommentLine = {
      func: this.#ActiveEditor.lineHandler.removeMultipleEmptyBlockCommentLine,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#insertEmptyBlockCommentLineOnEnd = {
      func: this.#ActiveEditor.lineHandler.insertEmptyBlockCommentLineOnEnd,
      type: LineType.LineEditType.DELETE,
      block: true
    };
    this.#setNowDateTimeOnLineOnLine = {
      func: this.#ActiveEditor.lineHandler.setNowDateTimeOnLine,
      type: LineType.LineEditType.APPEND
    };
  }
  // =============================================================================
  // > PUBLIC FUNCTIONS: 
  // =============================================================================
  /**
   * removes trailing whitespace from the line.
   * 
   * function type is; line.delete. 
   * 
   * @param editor unused, future reference  
   * @param edit unused, future reference 
   * @param args unused, future reference 
   */
  removeTrailingWhitespaceFromSelection = (editor, edit, args) => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  /**
   * removes multiple empty lines with EOL. 
   * this function will check if the currnt range and next range are 
   * both whitespace lines and if true, delete current range with EOL. 
   * function type is; line.delete.
   * 
   */
  removeMulitpleEmptyLinesFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMulitpleEmptyLines
      ],
      false
    );
  };
  /**
   * removes whitespaces that are longer than 1. 
   * this function will ignore starting whitespace group 
   * and remove all whitespaces in the line. 
   * this function could lead into range overlapping, which means 
   * that there is multiple edits in the same range which seems is 
   * not allowed. this collision happens when the range is 
   * empty line with whitespaces only and it start with it. 
   * more details in trailing whitespace function.
   * 
   */
  removeMultipleWhitespaceFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMultipleWhitespaceFromLine,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  /**
   * this will remove all empty whitespace lines from selection
   * function type is line.delete.
   */
  removeEmptyLinesFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeEmptyLines,
        this.#removeTrailingWhiteSpaceFromLine
      ],
      false
    );
  };
  /**
   * this will remove all commented lines from selection
   * function type is line.delete with EOL.
   */
  removeCommentedTextFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeCommentedTextFromLines
      ],
      false
    );
  };
  removeDuplicateLineFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeDuplicateLines
      ],
      false
    );
  };
  cleanUpBlockCommentFromSelection = () => {
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeEmptyBlockCommentLineOnStart,
        this.#removeMultipleEmptyBlockCommentLine,
        this.#insertEmptyBlockCommentLineOnEnd
        // this.#cleanUpBlockCommentLines,
      ],
      false
    );
  };
  /**
   * this command will do combined edit which are; 
   * - removeMultipleWhitespaceFromLine
   * - removeTrailingWhiteSpaceFromLine
   * - removeMulitpleEmptyLines
   * - cleanUpBlockCommentLines
   */
  cleanUpWhitespaceFromSelection = () => {
    console.log("????");
    this.#ActiveEditor.prepareEdit(
      [
        this.#removeMultipleWhitespaceFromLine,
        this.#removeTrailingWhiteSpaceFromLine,
        this.#removeEmptyBlockCommentLineOnStart,
        this.#removeMultipleEmptyBlockCommentLine,
        this.#insertEmptyBlockCommentLineOnEnd,
        this.#removeMulitpleEmptyLines
      ],
      false
    );
  };
  /**
   * this command will print datetime on where the cursor is.
   */
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
  const disposable = [];
  const command = new Command();
  disposable.push(
    ...Object.keys(EditorCommandId).filter((key) => !/^[+-]?\d+(\.\d+)?$/.test(key)).map((key) => {
      if (key in command) {
        return vscode5.commands.registerTextEditorCommand(package_default.name + "." + key, (editor, edit) => {
          const args = { lineEditFlag: EditorCommandId[key] };
          command[key](editor, edit, args);
        });
      } else {
        console.log("command ", key, "has no implementation");
      }
    })
  );
  disposable.push(vscode5.window.onDidChangeWindowState((editor) => {
    if (editor) {
    }
  }));
  disposable.push(vscode5.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
    }
  }));
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
