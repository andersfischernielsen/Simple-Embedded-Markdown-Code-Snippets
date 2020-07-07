export interface Analyzer {
    findInFile: (toFind: string, inFile: string) => string
}