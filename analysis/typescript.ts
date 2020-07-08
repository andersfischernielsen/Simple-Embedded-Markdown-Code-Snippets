import { Analyzer } from "./analyzer"
import ts from "typescript"

export class TypeScriptAnalyzer implements Analyzer {
    findInFile(toFind: string, inFile: string, lines: "entireFunction" | number, between: [number, number] | undefined) {
        const entireFile = ts.sys.readFile(inFile)
        if (!entireFile) throw Error("Could not parse input file as a valid TypeScript file.")
        const file = between ? entireFile.split("\n").slice(between[0], between[1]).join("\n") : entireFile
        const parsed = ts.createSourceFile("temp.ts", file, ts.ScriptTarget.ES2016);
        const results = parsed.statements
            .filter(s => s.kind === ts.SyntaxKind.FunctionDeclaration)
            .filter(result => {
                return ts.isFunctionDeclaration(result)
                    && result.name
                    && result.name.escapedText === toFind
            }).map(r => r.getText(parsed))
        const result = results.length > 0 ? results[0] : "No matching results"
        if (lines !== "entireFunction") return result.split("\n").slice(0, lines).join("\n")
        return result
    }
}