"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DefaultAnalyzer {
    findInFile(toFind, inFile, lines) {
        const file = fs_1.default.readFileSync(inFile).toString().split("\n");
        if (!file)
            throw Error(`Could not parse ${inFile} as a valid source file.`);
        let result = [];
        const regex = RegExp(`(.*)(${toFind})(.*)`);
        if (lines !== "entireFunction") {
            let found = false;
            let lineCount = lines;
            for (const line of file) {
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
        }
        else {
            let count = 0;
            for (const line of file) {
                if (regex.test(line)) {
                    count++;
                }
                if (count > 0)
                    result.push(line);
                if (line.match(".*{.*") && count > 0)
                    count++;
                if (line.match(".*}.*") && count > 0)
                    count--;
                if (line.match(".*}.*") && count === 1) {
                    break;
                }
            }
        }
        return result.join("\n");
    }
}
exports.DefaultAnalyzer = DefaultAnalyzer;
//# sourceMappingURL=defaultAnalyzer.js.map