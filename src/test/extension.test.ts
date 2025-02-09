import * as assert from "assert";
import { getI18nKeyPath } from "../utils/extractKeyPath";
import { Range } from "vscode";

suite("i18n Key Path Extraction Tests", () => {
  test("Extracts correct i18n key path from JSON", () => {
    const jsonData = `{
  "home": {
    "welcome": {
      "title": "Hello World"
    }
  }
}`;

    // ✅ Select the property key "title" (not the value "Hello World")
    const selection = new Range(3, 8, 3, 15); // Adjusted for your file’s whitespace
    const result = getI18nKeyPath(jsonData, selection, "json");
    console.log("🔎 Extracted Path (JSON):", result);
    assert.strictEqual(result, "home.welcome.title");
  });

  test("Extracts correct i18n key path from YAML", () => {
    const yamlData = `
home:
  welcome:
    title: "Hello from home"
`;

    // ✅ Select the property key "title"
    const selection = new Range(3, 4, 3, 9); // Adjust the range as needed
    const result = getI18nKeyPath(yamlData, selection, "yaml");
    console.log("🔎 Extracted Path (YAML):", result);
    assert.strictEqual(result, "home.welcome.title");
  });

  test("Returns null for missing key in JSON", () => {
    const jsonData = `{
  "home": {
    "welcome": {}
  }
}`;

    const selection = new Range(1, 10, 1, 20);
    const result = getI18nKeyPath(jsonData, selection, "json");
    console.log("🔎 Extracted Path (Missing Key JSON):", result);
    assert.strictEqual(result, null);
  });

  test("Returns null for missing key in YAML", () => {
    const yamlData = `
home:
  welcome: {}
`;

    const selection = new Range(1, 10, 1, 20);
    const result = getI18nKeyPath(yamlData, selection, "yaml");
    console.log("🔎 Extracted Path (Missing Key YAML):", result);
    assert.strictEqual(result, null);
  });
});