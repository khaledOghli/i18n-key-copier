import * as vscode from "vscode";
import { getI18nKeyPath } from "./utils/extractKeyPath";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 i18n Key Copier extension activated!");

  const copyKeyCommand = vscode.commands.registerCommand(
    "i18n-key-copier.copyKeyPath",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      // Ensure that something is actually selected.
      if (editor.selection.isEmpty) {
        vscode.window.showErrorMessage("Please select a key to copy its path.");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const text = document.getText(selection);
      console.log("🔍 Selected text:", text);

      // Determine file type based on the file extension.
      const fileType = document.fileName.endsWith(".json") ? "json" : "yaml";
      console.log("🛠 Detected file type:", fileType);

      // Extract the key path using our utility.
      const keyPath = getI18nKeyPath(document.getText(), selection, fileType);
      console.log("🔑 Extracted key path:", keyPath);

      if (keyPath) {
        await vscode.env.clipboard.writeText(keyPath);
        vscode.window.showInformationMessage(`Copied: ${keyPath}`);
      } else {
        vscode.window.showErrorMessage("Could not extract key path.");
      }
    }
  );

  context.subscriptions.push(copyKeyCommand);
}

export function deactivate() {
  console.log("❌ i18n Key Copier extension deactivated.");
}