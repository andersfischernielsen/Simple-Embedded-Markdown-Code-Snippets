"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
class TypeScriptAnalyzer {
    findInFile(toFind, inFile, lines, between) {
        const entireFile = typescript_1.default.sys.readFile(inFile);
        if (!entireFile)
            throw Error("Could not parse input file as a valid TypeScript file.");
        const file = between ? entireFile.split("\n").slice(between[0], between[1]).join("\n") : entireFile;
        const parsed = typescript_1.default.createSourceFile("temp.ts", file, typescript_1.default.ScriptTarget.ES2016);
        const results = parsed.statements
            .filter(s => s.kind === typescript_1.default.SyntaxKind.FunctionDeclaration)
            .filter(result => {
            return typescript_1.default.isFunctionDeclaration(result)
                && result.name
                && result.name.escapedText === toFind;
        }).map(r => r.getText(parsed));
        const result = results.length > 0 ? results[0] : "No matching results";
        if (lines !== "entireFunction")
            return result.split("\n").slice(0, lines).join("\n");
        return result;
    }
}
exports.TypeScriptAnalyzer = TypeScriptAnalyzer;
//# sourceMappingURL=typescript.js.map