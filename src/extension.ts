// src/extension.ts
import * as vscode from "vscode";
import { getI18nKeyPath } from "./utils/extractKeyPath";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 i18n Key Copier extension activated!");

  // Use registerTextEditorCommand so we get the editor and its selection.
  const copyKeyCommand = vscode.commands.registerTextEditorCommand(
    "i18n-key-copier.copyKeyPath",
    async (editor, edit) => {
      console.log("✅ Copy i18n Key Path command executed!");

      const document = editor.document;
      console.log("📄 Opened file:", document.fileName);

      const selection = editor.selection;
      const text = document.getText(selection);
      console.log("🔍 Selected text:", text);

      // If nothing is selected (or only whitespace), display an error.
      if (text.trim().length === 0) {
        vscode.window.showErrorMessage("Select a key to copy its path.");
        return;
      }

      // Determine the file type by its extension.
      const fileType = document.fileName.endsWith(".json") ? "json" : "yaml";
      console.log("🛠 Detected file type:", fileType);

      // Extract the key path from the entire document using the selected range.
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