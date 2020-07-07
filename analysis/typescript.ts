import { Analyzer } from "./analyzer"
import ts from "typescript"

export class TypeScriptAnalyzer implements Analyzer {
    findInFile(toFind: string, inFile: string) {
        const file = ts.sys.readFile(inFile)
        if (!file) throw Error("Could not parse input file as a valid TypeScript file.")
        const parsed = ts.createSourceFile("temp.ts", file, ts.ScriptTarget.ES2016);
        const results = parsed.statements
            .filter(s => s.kind === ts.SyntaxKind.FunctionDeclaration)
            .filter(result => {
                return ts.isFunctionDeclaration(result)
                    && result.name
                    && result.name.escapedText === toFind
            }).map(r => r.getText(parsed))
        return results.length > 0 ? results[0] : "No matching results"
    }
}