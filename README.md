# SEMCS: _Simple Embedded Markdown Code Snippets_

A tool for specifying, generating and inserting Markdown code snippets in Markdown documents from source files. 

This tool lets you specify code snippets based on function names from source files in Markdown documents and will generate inline snippets in the output documents for use in e.g. documentation, `READMEs`, etc. 

Snippets are defined using a small JSON DSL containing the references to the source files necessary for generating the snippet. Snippets can be customized to your liking, but come with sane defaults if you can't be bothered to customize them. 

## Usage
Run 
```
./semcs.js --input file.md --source file.ts
```

* `--input` takes either a directory containing Markdown files or individual files
* `--source` takes either a directory containing source files or individual files
* `--inplace` will overwrite files in place (be careful) - e.g. `./semcs.js --inplace --input file.md --source file.ts` 

## Snippet Generation

In Markdown documents, snippets are defined as follows: 

``` markdown
snippet {
    "name": "main",
    "file": "src/example.cs",
    ... # Other configuration goes here
}
```

The full range of options are: 

```
snippet {
    "name": string,                                   # required
    "file": string,                                   # required
    "language": string,                               # optional, defaults to "unknown"
    "generate_link": true | false,                    # optional, defaults to true
    "show_entire_function": true | false,             # optional, defaults to true
    "line_count": number | undefined,                 # optional, defaults to undefined
    "search_between": [number, number] | undefined    # optional, defaults to undefined
}
```

## Requirements
* This tool depends on `node.js` being installed on your system.
