/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerDocumentFormattingEditProvider('kukas', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let edits: vscode.TextEdit[] = [];
            let fullText = document.getText();
            let pythonScript = path.join(context.extensionPath, 'formatter', 'kukas_formatter.py');

            try {
                let formattedText = child_process.execSync(`python "${pythonScript}"`, {
                    input: fullText,
                    encoding: 'utf-8'
                });

                let fullRange = new vscode.Range(
                    document.lineAt(0).range.start,
                    document.lineAt(document.lineCount - 1).range.end
                );

                edits.push(vscode.TextEdit.replace(fullRange, formattedText));
            } catch (error) {
                vscode.window.showErrorMessage("Error running Python formatter: " + error);
            }

            return edits;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
