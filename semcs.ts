#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"

type All = "All"
type Some = string[]

interface Arguments {
    files: All | Some,
    inplace: true | false
    sourceFiles: string[]
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

const replaceSnippets = (file: string) => {
    fs.readFileSync(file)
}

const processFiles = (args: Arguments) => {
    if (!args.sourceFiles.every(exists)) throw new Error("One or more source files do not exist.")
    if (!args.sourceFiles.every(exists)) throw new Error("One or more source files do not exist.")
    const sourceDirectories = args.sourceFiles.filter(isDirectory)
    const sourceFiles = args.sourceFiles.filter(isFile)
    const sourceFileTypes = [".cs", ".ts", ".js", ".cpp", ".c", ".java"]
    const source = aggregateFiles(sourceDirectories, sourceFileTypes).concat(sourceFiles)
    const files = args.files === "All" ? aggregateFiles(["."], [".md"]) : args.files

    console.log(files)
    console.log(source)
}

const args = processArguments(process.argv);
processFiles(args)