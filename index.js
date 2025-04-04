let DBURL = ""

const MDConverter = new showdown.Converter()
MDConverter.convert = MDConverter.makeHtml

function getFile(file) {
    let requestor = new XMLHttpRequest()
    requestor.open("GET", file, false)
    requestor.send()
    return requestor.response
}

function getLanguageList(file = "languages.json") {
    console.warn("Loaded language list")
    let v = JSON.parse(getFile(DBURL + file))
    for (let l of v) {
        l.tagsnormalized = l.tags.map((t) => t.toLowerCase().replace(" ", "-"))
    }
    return v
}

let LANGUAGESLOADED = {}

function getLanguage(languageid) {
    return LANGUAGESLOADED[languageid] ?? (() => {
        console.warn(`Loaded ${languageid}`)
        let v = JSON.parse(getFile(DBURL + "languages/" + languageid + ".json"))
        LANGUAGESLOADED[languageid] = v
        //LANGUAGESLOADED[languageid].tagsnormalized = v.tags.map((t) => t.toLowerCase().replace(" ", "-"))
        return v
    }) ()
}

function makeLanguageShort(language) {
    return `<div class="language" id="${language.id}" onclick="showLanguage('${language.id}')">
                <h5>${language.name}</h5>
                <p>${language.description}</p>
                <div class="tags">
                    ${language.tags.map((e) => `<div>${e}</div>`).join("\n")}
                </div>
            </div>`
}

function makeLanguageShortForall(languages, condition = (e) => true) {
    return languages.map((e) => condition(e) ? makeLanguageShort(e) : "").join("")
}

let LANGUAGES
let LANGUAGESBYID = {}
let LANGUAGEVIEW
let LANGUAGELIST
let LOADEDPAGES = {}
let URLPARAMS

window.onload = (e) => {
    URLPARAMS = new URLSearchParams(window.location.search)
    let db = URLPARAMS.get("db")
    if (db !== null) {
        DBURL = db
    }
    LANGUAGEVIEW = document.querySelector("div.languageview")
    LANGUAGELIST = document.querySelector("div.languagelist")
    LANGUAGES = getLanguageList()
    LANGUAGES.forEach(l => {
        LANGUAGESBYID[l.id] = l
    });
    createLanguagesInList()
    let input = document.querySelector("input#search")
    input.oninput = (e) => {
        let v = input.value
        switchToList()
        querySearch(v)
    }
    let q = URLPARAMS.get("q")
    if (q !== null) {
        input.value = q
        querySearch(q)
    }
    let l = URLPARAMS.get("l")
    if (l !== null) {
        showLanguage(l)
    }
}

function createLanguagesInList() {
    let div = document.querySelector("div.languagelist")
    div.innerHTML = makeLanguageShortForall(LANGUAGES)
}

function makeTable(name, section) {
    return `<h3>${name}</h3>
            <table>
                <tbody>
                    ${section.map((feature) => `<tr>
                        <th><code>${feature.code ?? ""}</code></th>
                        <th>${feature.description ?? ""}</th>
                        <th><code>${feature.example ?? ""}</code></th>
                    </tr>`).join("")}
                </tbody>
            </table>`
}
function makeTablesForall(sections) {
    return Object.keys(sections).map((name) => makeTable(name, sections[name])).join(" ")
}

function showLanguage(id) {
    URLPARAMS.set("l", id)
    window.history.pushState({}, "", "?" + URLPARAMS.toString())

    let languageinfo = LANGUAGESBYID[id]
    let language = getLanguage(id)
    let html
    if (id in LOADEDPAGES) {
        html = LOADEDPAGES[id]
    }else{
        html = `<div onclick="switchToList()" style="cursor: pointer;">< Go Back</div>
                <h1>${languageinfo.name}</h1>
                <div id="description">${MDConverter.convert(language.description)}</div>
                <div class="tags">
                    ${languageinfo.tags.map((e) => `<div>${e}</div>`).join("\n")}
                </div>

                <h2>Syntax Overview</h2>
                <div class="syntax">
                    ${makeTablesForall(language.features)}
                </div>`
        LOADEDPAGES[id] = html
    }
    LANGUAGEVIEW.innerHTML = html
    LANGUAGELIST.style.display = "none"
    LANGUAGEVIEW.style.display = ""
}

function switchToList() {
    URLPARAMS.delete("l")
    window.history.pushState({}, "", "?" + URLPARAMS.toString())
    LANGUAGEVIEW.style.display = "none"
    LANGUAGELIST.style.display = ""
}

const NEGTAGREGEX = /-#[^\s]*/ig
const TAGREGEX = /#[^\s]*/ig
function querySearch(query = "") {
    URLPARAMS.set("q", query)
    if (query.trim() == "") {
        URLPARAMS.delete("q")
        for (const l of LANGUAGES) {
            document.querySelector(`div#${l.id}`).style.display = ""
        }
        window.history.pushState({}, "", "?" + URLPARAMS.toString())
        return
    }
    window.history.pushState({}, "", "?" + URLPARAMS.toString())
    
    const negtags = Array.from(query.matchAll(NEGTAGREGEX)).map(s => s[0].slice(2).toLowerCase())
    query = query.replace(NEGTAGREGEX, "")
    const tags = Array.from(query.matchAll(TAGREGEX)).map(s => s[0].slice(1).toLowerCase())
    query = query.replace(TAGREGEX, "")
    let all = query.trim() == ""
    query += "  "

    let yes = Object.keys(LANGUAGESBYID)
    let no = []
    if(!all){
        const fuse = new Fuse(LANGUAGES, {
            keys: ["author", "description", "name", "tags"],
            threshold: 0.3
        })
        const results = fuse.search(query)
        yes = results.map(l => l.item.id)
        no = LANGUAGES.filter(l => !yes.includes(l.id)).map(l => l.id)
    }
    yes:
    for (l in yes) {
        if (yes[l] === undefined) continue
        let T = LANGUAGES[l].tagsnormalized
        if (negtags.some((t) => T.includes(t))) {
            document.querySelector(`div#${yes[l]}`).style.display = "none"
        }
        else if (!tags.every((t) => T.includes(t))) {
            document.querySelector(`div#${yes[l]}`).style.display = "none"
        }
        /*for(const tag of LANGUAGES[l].tags) {
            if(negtags.length > 0 && negtags.includes(tag.toLowerCase().replace(" ", "-"))) {
                continue yes
            }
            if(tags.length > 0 && !tags.includes(tag.toLowerCase().replace(" ", "-"))) {
                document.querySelector(`div#${yes[l]}`).style.display = "none"
                continue yes
            }
        }*/
        else document.querySelector(`div#${yes[l]}`).style.display = ""
    }
    no:
    for (l in no) {
        if (no[l] === undefined) continue
        let T = LANGUAGES[l].tagsnormalized
        if (tags.every((t) => T.includes(t))) {
            document.querySelector(`div#${yes[l]}`).style.display = ""
        }
        /*for(const tag of LANGUAGES[l].tags) {
            if(tags.length > 0 && tags.includes(tag.toLowerCase().replace(" ", "-"))) {
                document.querySelector(`div#${no[l]}`).style.display = ""
                continue no
            }
        }*/
        else document.querySelector(`div#${no[l]}`).style.display = "none"
    }
}