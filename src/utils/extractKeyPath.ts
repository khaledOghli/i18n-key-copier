import jsonToAst from "json-to-ast";
import YAML from "yaml";
import { Range, Position } from "vscode";

/**
 * Given a file’s content, a selection (position), and a fileType, this function
 * returns the full i18n key path for a property only if its value is a leaf (i.e., a string).
 * Otherwise (if the property's value is an object/array), it returns null.
 */
export function getI18nKeyPath(
  content: string,
  selection: Range,
  fileType: "json" | "yaml"
): string | null {
  try {
    // Compute offsets for both the start and the end of the selection.
    const startOffset = getOffsetFromPosition(content, selection.start);
    const endOffset = getOffsetFromPosition(content, selection.end);
    const offset = selection.isEmpty
      ? startOffset
      : Math.floor((startOffset + endOffset) / 2);
    
    console.log("🔍 Using offset:", offset);

    if (fileType === "json") {
      const ast = jsonToAst(content, { loc: true });
      console.log("✅ JSON AST:", ast);
      return findJsonKeyPath(ast, offset);
    } else {
      // For YAML, keep CST nodes so we have location information.
      const doc = YAML.parseDocument(content, { keepCstNodes: true } as any);
      const ast = doc.contents;
      console.log("✅ YAML AST:", ast);
      return findYamlKeyPath(ast, offset);
    }
  } catch (error) {
    console.error("❌ Parsing Error:", error);
    return null;
  }
}

/**
 * Converts a vscode Position (line/character) into a file offset.
 */
function getOffsetFromPosition(content: string, position: Position): number {
  const lines = content.split(/\r?\n/);
  let offset = 0;
  for (let i = 0; i < position.line; i++) {
    offset += lines[i].length + 1; // +1 for the newline character
  }
  offset += position.character;
  return offset;
}

/**
 * Recursively searches the JSON AST (from json-to-ast) for a property
 * whose key token covers the given offset.
 * Returns the full dotted key path only if the property's value is a string literal.
 */
function findJsonKeyPath(node: any, offset: number, prefix: string = ""): string | null {
  if (node.type === "Object") {
    for (const property of node.children) {
      const keyNode = property.key;
      
      console.log("🔍 Checking JSON Key:", keyNode?.value);
      console.log("🔍 Key Range:", keyNode?.loc?.start.offset, "-", keyNode?.loc?.end.offset);
      console.log("🔍 Offset:", offset);

      if (
        keyNode &&
        keyNode.loc &&
        keyNode.loc.start.offset <= offset &&
        offset < keyNode.loc.end.offset
      ) {
        console.log("✅ Matched Key:", keyNode.value);
      
        if (property.value.type === "Literal" && typeof property.value.value === "string") {
          return prefix ? `${prefix}.${keyNode.value}` : keyNode.value;
        } else {
          // 🔥 FIX: Continue recursing instead of returning null
          const nestedKey = findJsonKeyPath(property.value, offset, prefix ? `${prefix}.${keyNode.value}` : keyNode.value);
          return nestedKey !== null ? nestedKey : null;
        }
      }

      if (property.value && (property.value.type === "Object" || property.value.type === "Array")) {
        const childResult = findJsonKeyPath(
          property.value,
          offset,
          prefix ? `${prefix}.${property.key.value}` : property.key.value
        );
        if (childResult !== null) {
          return childResult;
        }
      }
    }
  } else if (node.type === "Array") {
    for (const item of node.children) {
      const childResult = findJsonKeyPath(item, offset, prefix);
      if (childResult !== null) {
        return childResult;
      }
    }
  }
  return null;
}

/**
 * Recursively searches the YAML AST (from the 'yaml' package) for a mapping key node
 * whose range covers the given offset.
 * Returns the full dotted key path only if the corresponding value is a scalar string.
 * If the value is a mapping (even an empty one) or otherwise not a string, returns null.
 */
export function findYamlKeyPath(node: any, offset: number, prefix: string = ""): string | null {
  if (node && node.items && Array.isArray(node.items)) {
    for (const pair of node.items) {
      const keyNode = pair.key;

      console.log("🔍 Checking YAML Key:", keyNode?.value);
      console.log("🔍 Key Range:", keyNode?.range ? keyNode.range[0] : "N/A", "-", keyNode?.range ? keyNode.range[1] : "N/A");
      console.log("🔍 Offset:", offset);

      if (
        keyNode &&
        keyNode.range &&
        keyNode.range[0] <= offset &&
        offset < keyNode.range[1]
      ) {
        console.log("✅ Matched Key:", keyNode.value);

        if (pair.value && typeof pair.value.value === "string" && !Array.isArray(pair.value.items)) {
          return prefix ? `${prefix}.${keyNode.value}` : keyNode.value;
        }
      }
      
      if (pair.value && Array.isArray(pair.value.items) && pair.value.items.length > 0) {
        console.log(`🔍 Checking key: ${keyNode.value}, Has Items:`, pair.value.items ? "✅ Yes" : "❌ No");
        const childResult = findYamlKeyPath(
          pair.value,
          offset,
          prefix ? `${prefix}.${keyNode.value}` : keyNode.value
        );
        if (childResult !== null) {
          return childResult;
        }
      }
    }
  }
  return null;
}