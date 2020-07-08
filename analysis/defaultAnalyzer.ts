import { Analyzer } from "./analyzer"
import fs from "fs"

export class DefaultAnalyzer implements Analyzer {
    findInFile(toFind: string, inFile: string, lines: "entireFunction" | number) {
        const file = fs.readFileSync(inFile).toString().split("\n")
        if (!file) throw Error(`Could not parse ${inFile} as a valid source file.`)

        let result = []
        const regex = RegExp(`(.*)(${toFind})(.*)`)
        if (lines !== "entireFunction") {
            let found = false
            let lineCount = lines
            for (const line of file) {
                if (regex.test(line)) {
                    found = true
                }
                if (found === true) {
                    result.push(line)
                    lineCount--
                }
                if (found && lineCount === 0) break
            }
        } else {
            let count = 0
            for (const line of file) {
                if (regex.test(line)) {
                    count++
                }
                if (count > 0) result.push(line)
                if (line.match(".*{.*") && count > 0) count++;
                if (line.match(".*}.*") && count > 0) count--
                if (line.match(".*}.*") && count === 1) {
                    break
                }
            }
        }

        return result.join("\n")
    }
}