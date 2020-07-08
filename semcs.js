#!/usr/bin/env node
!function(e,t){for(var n in t)e[n]=t[n]}(this,function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("fs")},function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const s=o(n(0)),c=o(n(2)),l=n(3),u=e=>{const t=e;if(!t)throw Error("Snippet could not be parsed: \n"+e.toString());return void 0===t.generate_link&&(t.generate_link=!0),void 0!==t.show_entire_function||t.line_count||(t.show_entire_function=!0),t},a=e=>s.existsSync(e),f=e=>s.lstatSync(e).isDirectory(),d=e=>s.lstatSync(e).isFile(),p=(e,t)=>e.reduce((e,n)=>{if(f(n)){const r=s.readdirSync(n).map(e=>n+"/"+e);return e.concat(p(r,t))}{if(!a(n))return e;const r=c.extname(n);return t.includes(r)?e.concat([n]):e}},[]),g=(e,t)=>{try{const n=((e,t,n)=>{let r=s.readFileSync(e).toString().split("\n");for(const i of t.reverse()){const t=+i.starts_at,o=+i.ends_at;r[t]="``` "+(i.language&&"auto"!==i.language?i.language:""),r[o]=i.generate_link?`\`\`\`\n(From [\`${i.file}\`](${i.file}))`:"```";for(let e=t+1;e<=o-1;e++)delete r[e];const s=i.language&&l.knownLanguages[i.language]?l.knownLanguages[i.language]:l.knownLanguages.unknown,c=n.find(e=>e===i.file);if(!c)throw Error(`The source file declared in the snippet starting at ${i.starts_at} in ${e} has not been provided.`);const u=i.show_entire_function||void 0===i.line_count?"entireFunction":+i.line_count,a=s.findInFile(i.name,c,u,i.search_between);r[t+1]=a}return r.join("\n")})(e,(e=>{const t=RegExp("snippet\\s*{"),n=s.readFileSync(e).toString().split("\n");let r=[],i=!1,o="",c=0;for(let e of n){const n=t.test(e),s=e.trim().startsWith("}");if(n&&(i=!0,e=e.replace("snippet {",`{"starts_at": "${c}",`)),i&&(s&&(e=e.replace("}",`, "ends_at": "${c}" }`)),o+=e),s){i=!1;const e=u(JSON.parse(o));r.push(e),o=""}c+=1}return r})(e),t);s.writeFileSync(e+".out",n)}catch(e){console.log(e)}};(e=>{if(!e.sourceFiles.every(a))throw new Error("One or more source files do not exist.");const t=e.sourceFiles.filter(f),n=e.sourceFiles.filter(d),r=p(t,[".cs",".ts",".js",".cpp",".c",".java"]).concat(n),i="All"===e.files?p(["."],[".md"]):e.files;if(!i.every(a))throw new Error("One or more input files do not exist.");i.forEach(e=>g(e,r))})((e=>{const t=e.slice(2),n=t.indexOf("--input"),r=t.indexOf("--source"),i=t.indexOf("--inplace");if(!(t.includes("--all")||t.includes("--input"))||!t.includes("--source")||r<n||-1==r||r==t.length-1||-1!==i&&i<r&&i>n)throw new Error("Incorrect argument(s). \nEither '--all' or '--input' must be specified for input files followed by '--source' for source files or a source directory. \nE.g. './semcs --inplace (optional) --input [...] --source [...] | directory' such as '--input file.md --source file.cs' or '--input file.md --source src/'.");const o=t.includes("--inplace");return{files:t.includes("--all")?"All":t.slice(n+1,r),inplace:o,sourceFiles:t.slice(r+1)}})(process.argv))},function(e,t){e.exports=require("path")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.knownLanguages=void 0;const r=n(4),i=n(6);t.knownLanguages={typescript:new r.TypeScriptAnalyzer,unknown:new i.DefaultAnalyzer}},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.TypeScriptAnalyzer=void 0;const i=r(n(5));t.TypeScriptAnalyzer=class{findInFile(e,t,n,r){const o=i.default.sys.readFile(t);if(!o)throw Error("Could not parse input file as a valid TypeScript file.");const s=r?o.split("\n").slice(r[0],r[1]).join("\n"):o,c=i.default.createSourceFile("temp.ts",s,i.default.ScriptTarget.ES2016),l=c.statements.filter(e=>e.kind===i.default.SyntaxKind.FunctionDeclaration).filter(t=>i.default.isFunctionDeclaration(t)&&t.name&&t.name.escapedText===e).map(e=>e.getText(c)),u=l.length>0?l[0]:"No matching results";return"entireFunction"!==n?u.split("\n").slice(0,n).join("\n"):u}}},function(e,t){e.exports=require("typescript")},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.DefaultAnalyzer=void 0;const i=r(n(0));t.DefaultAnalyzer=class{findInFile(e,t,n,r){const o=i.default.readFileSync(t).toString().split("\n");if(!o)throw Error(`Could not parse ${t} as a valid source file.`);let s=0,c=[];const l=RegExp(`(.*)(${e})(.*)`);let u=0,a="entireFunction"===n?0:n,f=!1;for(const e of o)if(r&&s<r[0])s++;else{if("entireFunction"!==n){if(l.test(e)&&(f=!0),!0===f&&(c.push(e),a--),f&&0===a)break}else if(l.test(e)&&u++,u>0&&c.push(e),e.match(".*{.*")&&u>0&&u++,e.match(".*}.*")&&u>0&&u--,e.match(".*}.*")&&1===u)break;if(r&&s>r[1])break;s++}return 0===c.length?"No matching results":c.join("\n")}}}]));