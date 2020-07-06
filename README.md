# SEMCS 

***

_Simple Embedded Markdown Code Snippets_

***

A tool for specifying, generating and inserting Markdown code snippets in Markdown documents from source files. 

This tool lets you specify code snippets from source files in Markdown documents and will generate inline snippets in the output documents for use in e.g. documentation, READMEs, etc. 

Snippets are defined using a small JSON-like DSL containing the references to the source files necessary for generating the snippet. Snippets can be customized to your liking, but come with sane defaults if you can't be bothered to customize them. 

## Snippet Generation

In Markdown documents, snippets are defined as follows: 

``` markdown
snippet {
    name: "main",
    file: "src/example.cs",
    ... # Other configuration goes here
}
```

The full range of options are: 

```
snippet {
    name: string,                           # required
    file: string,                           # required
    type: "function" | "variable",          # optional, defaults to "function"
	language: string,                       # optional, defaults to "auto"
	show_entire_function: true | false,     # optional, defaults to true
	generate_link: true | false,            # optional, defaults to true
    line_count: number | None,              # optional, defaults to None
	search_between: [number, number] | None # optional, defaults to None
}