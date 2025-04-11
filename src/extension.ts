import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';

// Declare a constant for supported languages
const supportedLanguages: string[] = ['fanuc', 'krl'];

// Define a literal type for the supported languages
type SupportedLanguage = 'fanuc' | 'krl';

export function activate(context: vscode.ExtensionContext) {
  // Register document formatting providers for each supported language
  supportedLanguages.forEach(language => {
    const formatter = vscode.languages.registerDocumentFormattingEditProvider(language, {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const fullText = document.getText();
        const scriptFileName = `${language}_formatter.py`; // e.g., fanuc_formatter.py
        const pythonFormatterPath = path.join(context.extensionPath, scriptFileName);

        try {
          const result = cp.execSync(`python "${pythonFormatterPath}"`, {
            input: fullText,
            encoding: 'utf-8'
          });

          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fullText.length)
          );

          return [vscode.TextEdit.replace(fullRange, result)];
        } catch (error) {
          vscode.window.showErrorMessage(`Formatting failed for ${language}: ${error}`);
          return [];
        }
      }
    });

    context.subscriptions.push(formatter);
  });
}

function openAndFormatFile(filePath: string, language: SupportedLanguage) {
    const content = fs.readFileSync(filePath);
    const decoded = iconv.decode(content, 'shift_jis');
  
    vscode.workspace.openTextDocument({ content: decoded, language: language }).then(doc => {
      vscode.window.showTextDocument(doc).then(editor => {
        // Just trigger formatting command
        vscode.commands.executeCommand('editor.action.formatDocument');
      });
    });
  }

export function deactivate() {}
