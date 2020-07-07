import { Analyzer } from "./analyzer"
import fs from "fs"

export class DefaultAnalyzer implements Analyzer {
    findInFile(toFind: string, inFile: string) {
        const file = fs.readFileSync(inFile).toString().split("\n")
        if (!file) throw Error(`Could not parse ${inFile} as a valid source file.`)

        let result = []
        let count = 0
        const regex = RegExp(`(.*)(${toFind})(.*)`)
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

        return result.join("\n")
    }
}