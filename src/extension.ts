import * as vscode from "vscode";
import { getI18nKeyPath } from "./utils/extractKeyPath";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 i18n Key Copier extension activated!");

  const copyKeyCommand = vscode.commands.registerCommand(
    "i18n-key-copier.copyKeyPath",
    async () => {
      console.log("✅ Copy i18n Key Path command executed!");

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        console.log("❌ No active editor found!");
        return;
      }

      const document = editor.document;
      console.log("📄 Opened file:", document.fileName);

      const selection = editor.selection;
      const text = document.getText(selection);
      console.log("🔍 Selected text:", text);

      if (!text) {
        vscode.window.showErrorMessage("Select a key to copy its path.");
        return;
      }

      // Determine the file type from the file name extension.
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