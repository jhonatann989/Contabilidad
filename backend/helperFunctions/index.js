import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let modules = {}

for(let file of fs.readdirSync(`${__dirname}`)) {
    let filename = file.split(".")
    try {
        if (filename[1] == "js" && filename[0] != "index") {
            let importedModule = await import(`./${file}`)
            modules[filename[0]] = importedModule.default
        }
    } catch (error) {
        console.log(error)
    }
}

export default modules