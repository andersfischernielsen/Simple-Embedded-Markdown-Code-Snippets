import { Analyzer } from "./analyzer"
import fs from "fs"

export class DefaultAnalyzer implements Analyzer {
    findInFile(toFind: string, inFile: string, lines: "entireFunction" | number, between: [number, number] | undefined) {
        const file = fs.readFileSync(inFile).toString().split("\n")
        if (!file) throw Error(`Could not parse ${inFile} as a valid source file.`)

        let count = 0
        let result = []
        const regex = RegExp(`(.*)(${toFind})(.*)`)
        let parenthesesCount = 0
        let lineCount = lines === "entireFunction" ? 0 : lines
        let found = false
        for (const line of file) {
            if (between && count < between[0]) {
                count++
                continue
            }

            if (lines !== "entireFunction") {
                if (regex.test(line)) {
                    found = true
                }
                if (found === true) {
                    result.push(line)
                    lineCount--
                }
                if (found && lineCount === 0) break
            }
            else {
                if (regex.test(line)) {
                    parenthesesCount++
                }
                if (parenthesesCount > 0) result.push(line)
                if (line.match(".*{.*") && parenthesesCount > 0) parenthesesCount++;
                if (line.match(".*}.*") && parenthesesCount > 0) parenthesesCount--
                if (line.match(".*}.*") && parenthesesCount === 1) {
                    break
                }
            }
            if (between && count > between[1]) break
            count++
        }

        return result.length === 0 ? "No matching results" : result.join("\n")
    }
}