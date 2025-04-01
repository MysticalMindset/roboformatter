import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerDocumentFormattingEditProvider('krl', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let edits: vscode.TextEdit[] = [];
            let formattedText: string[] = [];
            let indent = "   "; // Teach Pendant uses 3 spaces
            let insideFoldBlock = false;

            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i).text.trim();

                // Detect and process ";FOLD" lines
                if (line.startsWith(";FOLD")) {
                    insideFoldBlock = true;  // Mark as inside a FOLD block
                    continue;  // Skip adding this line to the formatted text
                }

                // Skip everything inside the FOLD block
                if (insideFoldBlock) {
                    if (line.startsWith(";ENDFOLD")) {
                        insideFoldBlock = false;  // End skipping after ";ENDFOLD"
                    }
                    continue;  // Skip lines inside the fold block
                }

                // Convert keywords to uppercase
                line = line.replace(/\b(def|end|if|then|else|endif|loop|endloop|exit|decl|global|interrupt|do|when)\b/gi, 
                                    match => match.toUpperCase());

                // Add spaces around assignment and comparison operators
                line = line.replace(/([=<>+\-*/]+)/g, " $1 ");

                // Format FOLD sections properly (if they start a new line)
                if (line.startsWith(";FOLD") || line.startsWith(";ENDFOLD")) {
                    formattedText.push("\n" + line);
                }
                // Indent key commands
                else if (line.startsWith("PTP") || line.startsWith("LIN") || line.startsWith("DECL") || line.startsWith("IF") || 
                         line.startsWith("LOOP") || line.startsWith("EXIT") || line.startsWith("ENDIF") || line.startsWith("ENDLOOP")) {
                    formattedText.push(indent + line);
                } 
                else {
                    formattedText.push(line);
                }
            }

            let fullRange = new vscode.Range(
                document.lineAt(0).range.start,
                document.lineAt(document.lineCount - 1).range.end
            );

            edits.push(vscode.TextEdit.replace(fullRange, formattedText.join("\n")));
            return edits;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
