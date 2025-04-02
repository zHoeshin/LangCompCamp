# LangCompCamp
Accessible on [GithubPages](https://zhoeshin.github.io/).
A simple tool to load a database containing programming language syntax overviev from a github repo.
You can use any github repo for the database: for this use url param db, ie `https://zhoeshin.github.io/?db=link.to.your/repo/`
Normally the link would be `https://zhoeshin.github.io/?db=https://github.com/{username}/{reponame}/blob/main/`
An example of such database can be found on [here](https://github.com/zHoeshin/langcompcampdbexample)([link to the website with using this example db](https://zhoeshin.github.io/LangCompCamp/?db=https%3A%2F%2Fraw.githubusercontent.com%2FzHoeshin%2Flangcompcampdbexample%2Frefs%2Fheads%2Fmain%2F))

## Features IDs
In the future there migth be a page consisting of the comparison of ALL the languages every uploaded, so to keep it clean some most common features(general syntax, operators, string manipulation, classes, etc) will have "id" field in the feature. The field is optional.
List of feature IDs:
- g-block
- g-comment
- g-commend-mn
- g-commend-d
- g-idregex
- g-casesensitive
- g-capitalization
- g-op-add
- g-op-sub
- g-op-mul
- g-op-div-float
- g-op-exp
- g-op-modulo
- to be continued...
