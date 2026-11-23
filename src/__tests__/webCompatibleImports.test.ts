// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// react-native-web does not export these, so importing one from "react-native"
// crashes any keypad rendered on the web (0.1.0 shipped with useAnimatedValue).
const NOT_ON_WEB = ["useAnimatedValue"];

const SRC = path.resolve(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe("web-compatible react-native imports", () => {
  it("imports nothing from react-native that react-native-web lacks", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const src = readFileSync(file, "utf8");
      for (const match of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*"react-native"/g)) {
        for (const name of NOT_ON_WEB) {
          if (new RegExp(`\\b${name}\\b`).test(match[1])) offenders.push(`${path.relative(SRC, file)}: ${name}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
