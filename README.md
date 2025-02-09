# i18n Key Copier

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/your-publisher-id.i18n-key-copier.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=your-publisher-id.i18n-key-copier)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/your-publisher-id.i18n-key-copier.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=your-publisher-id.i18n-key-copier)

## Overview

**i18n Key Copier** is a lightweight Visual Studio Code extension that allows you to easily copy internationalization (i18n) key paths from JSON and YAML files. With a simple right-click or a Command Palette invocation, you can extract a fully qualified key (e.g., `home.welcome.title`) and copy it to your clipboard, streamlining your i18n workflow.

## Features

- **Extract i18n Key Paths:** Automatically generate a dot-notated key (e.g., `home.welcome.title`) from your JSON or YAML files.
- **Context Menu Integration:** Access the command by right-clicking in your editor.
- **Command Palette Access:** Invoke the command using the Command Palette.
- **Language Support:** Works with JSON, YAML, and YML files.

## Installation

### Via Visual Studio Code Marketplace

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).
3. Search for **i18n Key Copier**.
4. Click **Install** on the extension published by `your-publisher-id`.

### From a VSIX Package

1. Download the `.vsix` file from the [Releases](#) page of the repository.
2. In Visual Studio Code, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3. Run the command `Extensions: Install from VSIX...` and select the downloaded file.

## Usage

1. **Open a File:**
   Open a JSON or YAML file containing your i18n keys. For example:

   ```yaml
   home:
     welcome:
       title: "Hello from home"