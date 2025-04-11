"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
// Declare a constant for supported languages
const supportedLanguages = ['fanuc', 'krl'];
function activate(context) {
    vscode.workspace.onDidOpenTextDocument(doc => {
        if (supportedLanguages.includes(doc.languageId)) {
            vscode.window.showTextDocument(doc).then(() => {
                vscode.commands.executeCommand('editor.action.formatDocument');
            });
        }
    });
    // Register document formatting providers for each supported language
    supportedLanguages.forEach(language => {
        const formatter = vscode.languages.registerDocumentFormattingEditProvider(language, {
            provideDocumentFormattingEdits(document) {
                const fullText = document.getText();
                const scriptFileName = `${language}_formatter.py`; // e.g., fanuc_formatter.py
                const pythonFormatterPath = path.join(context.extensionPath, scriptFileName);
                try {
                    const result = cp.execSync(`python "${pythonFormatterPath}"`, {
                        input: fullText,
                        encoding: 'utf-8'
                    });
                    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
                    return [vscode.TextEdit.replace(fullRange, result)];
                }
                catch (error) {
                    vscode.window.showErrorMessage(`Formatting failed for ${language}: ${error}`);
                    return [];
                }
            }
        });
        context.subscriptions.push(formatter);
    });
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(doc => {
        if (supportedLanguages.includes(doc.languageId)) {
            vscode.window.showTextDocument(doc).then(() => {
                vscode.commands.executeCommand('editor.action.formatDocument');
            });
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map