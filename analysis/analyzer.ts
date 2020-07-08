export interface Analyzer {
    findInFile: (toFind: string, inFile: string, lines: "entireFunction" | number, between: [number, number] | undefined) => string
}