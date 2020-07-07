"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DefaultAnalyzer {
    findInFile(toFind, inFile) {
        const file = fs_1.default.readFileSync(inFile).toString().split("\n");
        if (!file)
            throw Error(`Could not parse ${inFile} as a valid source file.`);
        let result = [];
        let count = 0;
        const regex = RegExp(`(.*)(${toFind})(.*)`);
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
        return result.join("\n");
    }
}
exports.DefaultAnalyzer = DefaultAnalyzer;
//# sourceMappingURL=defaultAnalyzer.js.map