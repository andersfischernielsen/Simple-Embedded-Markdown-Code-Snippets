export interface Analyzer {
    findInFile: (toFind: string, inFile: string, lines: "entireFunction" | number) => string
}