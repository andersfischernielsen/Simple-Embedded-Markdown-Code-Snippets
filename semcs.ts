import * as fs from "fs"
import * as path from "path"
import { knownLanguages } from "./analysis/knownLanguages"

type All = "All"
type Some = string[]

interface Arguments {
    files: All | Some,
    inplace: true | false
    sourceFiles: string[]
}

interface Snippet {
    name: string,
    file: string,
    language: string,                               // optional, defaults to "unknown"
    generate_link: true | false,                    // optional, defaults to true
    show_entire_function: true | false,             // optional, defaults to true
    line_count: number | undefined,                 // optional, defaults to undefined
    search_between: [number, number] | undefined    // optional, defaults to undefined
    starts_at: number,
    ends_at: number
}

const populateSnippet = (s: any) => {
    const cast = s as Snippet
    if (!cast) throw Error(`Snippet could not be parsed: \n${s.toString()}`)
    if (cast.generate_link === undefined) cast.generate_link = true
    if (cast.show_entire_function === undefined && !cast.line_count) cast.show_entire_function = true
    return cast
}

const processArguments = (processArgs: string[]) => {
    const relevantArgs = processArgs.slice(2)
    const filesIndex = relevantArgs.indexOf("--input")
    const sourceIndex = relevantArgs.indexOf("--source")
    const inplaceIndex = relevantArgs.indexOf("--inplace")
    const error = !(relevantArgs.includes("--all") || relevantArgs.includes("--input"))
        || !relevantArgs.includes("--source")
        || sourceIndex < filesIndex
        || sourceIndex == -1
        || sourceIndex == relevantArgs.length - 1
        || inplaceIndex !== -1 && inplaceIndex < sourceIndex && inplaceIndex > filesIndex
    if (error) throw new Error("Incorrect argument(s). \nEither '--all' or '--input' must be specified for input files followed by '--source' for source files or a source directory. \nE.g. './semcs --inplace (optional) --input [...] --source [...] | directory' such as '--input file.md --source file.cs' or '--input file.md --source src/'.")

    const inplace = relevantArgs.includes("--inplace")
    const files = relevantArgs.includes("--all") ? "All" : relevantArgs.slice(filesIndex + 1, sourceIndex)
    const source = relevantArgs.slice(sourceIndex + 1)

    const args: Arguments = {
        files: files,
        inplace: inplace,
        sourceFiles: source
    }
    return args
}

const exists = (path: string) => fs.existsSync(path)
const isDirectory = (path: string) => fs.lstatSync(path).isDirectory()
const isFile = (path: string) => fs.lstatSync(path).isFile()

const aggregateFiles = (files: string[], fileTypes: string[]): string[] => {
    const aggregate = (acc: string[], f: string) => {
        if (isDirectory(f)) {
            const innerFiles = fs.readdirSync(f);
            const withPaths = innerFiles.map(file => f + '/' + file)
            return acc.concat(aggregateFiles(withPaths, fileTypes))
        }
        else {
            if (!exists(f)) return acc
            const type = path.extname(f)
            return (fileTypes.includes(type)) ? acc.concat([f]) : acc
        }
    }
    const reduced = files.reduce(aggregate, [])
    return reduced
}

const findSnippets = (file: string) => {
    const regex = RegExp("snippet\\s*{")
    const contents = fs.readFileSync(file)
    const lines = contents.toString().split("\n")
    //TODO: Make this functional instead of these nasty stateful loops
    let snippets: Snippet[] = []
    let isMatching = false
    let buildingSnippet = ""
    let count = 0
    for (let l of lines) {
        const matchStart = regex.test(l);
        const matchEnd = l.trim().startsWith("}")
        if (matchStart) {
            isMatching = true;
            l = l.replace("snippet {", `{"starts_at": "${count}",`);
        }
        if (isMatching) {
            if (matchEnd) { l = l.replace("}", `, "ends_at": "${count}" }`) }
            buildingSnippet += l
        }
        if (matchEnd) {
            isMatching = false
            const snippet = populateSnippet(JSON.parse(buildingSnippet) as Snippet)
            snippets.push(snippet)
            buildingSnippet = ""
        }
        count += 1
    }
    return snippets
}

const replaceFileContents = (file: string, snippets: Snippet[], source: string[]) => {
    const contents = fs.readFileSync(file)
    let lines = contents.toString().split("\n")

    for (const snippet of snippets.reverse()) {
        const start = (+snippet.starts_at)
        const end = (+snippet.ends_at)
        lines[start] = "``` " + (snippet.language && snippet.language !== "auto" ? snippet.language : "")
        lines[end] = snippet.generate_link ? `\`\`\`\n(From [\`${snippet.file}\`](${snippet.file}))` : "```"

        for (let line = start + 1; line <= end - 1; line++) {
            delete lines[line]
        }

        const analyzer = snippet.language && knownLanguages[snippet.language]
            ? knownLanguages[snippet.language]
            : knownLanguages["unknown"]
        const sourceFile = source.find(s => s === snippet.file)
        if (!sourceFile) throw Error(`The source file declared in the snippet starting at ${snippet.starts_at} in ${file} has not been provided.`)
        const lineCount = !snippet.show_entire_function && snippet.line_count !== undefined ? +snippet.line_count : "entireFunction"
        const result = analyzer.findInFile(snippet.name, sourceFile, lineCount, snippet.search_between)
        lines[start + 1] = result
    }

    return lines.join("\n")
}

const replaceSnippets = (file: string, source: string[]) => {
    try {
        const snippets = findSnippets(file)
        const replaced = replaceFileContents(file, snippets, source);
        fs.writeFileSync(`${file}.out`, replaced)
    } catch (e) {
        console.log(e)
    }
}

const processFiles = (args: Arguments) => {
    if (!args.sourceFiles.every(exists)) throw new Error("One or more source files do not exist.")
    const sourceDirectories = args.sourceFiles.filter(isDirectory)
    const sourceFiles = args.sourceFiles.filter(isFile)
    const sourceFileTypes = [".cs", ".ts", ".js", ".cpp", ".c", ".java"]
    const source = aggregateFiles(sourceDirectories, sourceFileTypes).concat(sourceFiles)
    const files = args.files === "All" ? aggregateFiles(["."], [".md"]) : args.files
    if (!files.every(exists)) throw new Error("One or more input files do not exist.")
    files.forEach(f => replaceSnippets(f, source))
}

const args = processArguments(process.argv);
processFiles(args)