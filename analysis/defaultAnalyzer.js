"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DefaultAnalyzer {
    findInFile(toFind, inFile, lines, between) {
        const file = fs_1.default.readFileSync(inFile).toString().split("\n");
        if (!file)
            throw Error(`Could not parse ${inFile} as a valid source file.`);
        let count = 0;
        let result = [];
        const regex = RegExp(`(.*)(${toFind})(.*)`);
        console.log(between);
        let parenthesesCount = 0;
        let lineCount = lines === "entireFunction" ? 0 : lines;
        let found = false;
        for (const line of file) {
            console.log(count);
            if (between && count < between[0]) {
                count++;
                continue;
            }
            console.log("run");
            if (lines !== "entireFunction") {
                if (regex.test(line)) {
                    found = true;
                }
                if (found === true) {
                    result.push(line);
                    lineCount--;
                }
                if (found && lineCount === 0)
                    break;
            }
            else {
                if (regex.test(line)) {
                    parenthesesCount++;
                }
                if (parenthesesCount > 0)
                    result.push(line);
                if (line.match(".*{.*") && parenthesesCount > 0)
                    parenthesesCount++;
                if (line.match(".*}.*") && parenthesesCount > 0)
                    parenthesesCount--;
                if (line.match(".*}.*") && parenthesesCount === 1) {
                    break;
                }
            }
            if (between && count > between[1])
                break;
            count++;
        }
        return result.join("\n");
    }
}
exports.DefaultAnalyzer = DefaultAnalyzer;
//# sourceMappingURL=defaultAnalyzer.js.map