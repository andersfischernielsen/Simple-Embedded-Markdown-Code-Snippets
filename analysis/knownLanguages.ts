import { TypeScriptAnalyzer } from "./typescript"
import { DefaultAnalyzer } from "./defaultAnalyzer"
import { Analyzer } from "./analyzer"

export const knownLanguages: { [name: string]: Analyzer } = {
    "typescript": new TypeScriptAnalyzer(),
    "unknown": new DefaultAnalyzer()
}