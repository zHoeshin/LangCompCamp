# LangCompCamp
Accessible on [GithubPages](https://zhoeshin.github.io/LangCompCamp).
A simple tool to load a database containing programming language syntax overviev from a github repo.
You can use any github repo for the database: for this use url param db, ie `https://zhoeshin.github.io/?db=link.to.your/repo/`
Normally the link would be `https://zhoeshin.github.io/?db=https://github.com/{username}/{reponame}/blob/main/`
An example of such database can be found on [here](https://github.com/zHoeshin/langcompcampdb)([link to the website with using this example db](https://zhoeshin.github.io/LangCompCamp/?db=zHoeshin%2Flangcompcampdb))

## How to contribute?
Schemas:
- Languages list: https://github.com/zHoeshin/LangCompCamp/blob/main/languages-schema
- Individual language files: https://github.com/zHoeshin/LangCompCamp/blob/main/language-schema
1. Go to the database github repo you want to contribute to, for example https://github.com/zHoeshin/langcompcampdb
2. Add your language into the `language.json` in the database. languages.json stores an array of `{"name": string, "id": string, "author": string, "description": string, "tags": array[string]}`
3. Add your language file into the `languages/` folder. The file must be named `<language-id>.json` where `language-id` is the id you specified for your language in the `languages.json`
4. ### Language file
The file is in form
```
lang = {
  "description": string,
  "features": dict[string -> featurelist]
}
```
where
```
featurelist = [feature]
feature = {"type": string = "entry", ...}
```
#### Features
Currently there are  types of features:
- entry
  - appends a row into the table, each column is a field in the feature
- header
  - same as entry but bold
- column
  - takes field `id` and optional field `remove` defaulted to false. if `remove` is true, removes a column, otherwise adds. this only affects features after, does not affect features before
- wrapper
  - takes field `id` and two optional fields `before` and `after`, both defaulted to empty string. before an entry's field is MD-converted, adds the fields as prefix and postfix respectively to the string
  - for example ``{"type": "wrapper", "id": "usage", "before": "#`", "after": "`"}`` would turn field `"usage": "print(arg)"` into ``"#`print(arg)"`` and when MD-converted it turns into a header with code


#### Features IDs
In the future there migth be a page consisting of the comparison of ALL the languages every uploaded, so to keep it clean some most common features(general syntax, operators, string manipulation, classes, etc) will have "id" field in the feature. The field is for the entry type features and is opotional
