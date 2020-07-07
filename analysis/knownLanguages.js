"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("./typescript");
const defaultAnalyzer_1 = require("./defaultAnalyzer");
exports.knownLanguages = {
    "typescript": new typescript_1.TypeScriptAnalyzer(),
    "unknown": new defaultAnalyzer_1.DefaultAnalyzer()
};
//# sourceMappingURL=knownLanguages.js.map