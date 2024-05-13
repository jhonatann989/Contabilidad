import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let modules = {}

fs.readdirSync(`${__dirname}`).forEach(file => {
    let filename = file.split(".")
    try {
        if (filename[1] == "js" && filename[0] != "index") {
            modules[filename[0]] = require(`${__dirname}/${file}`)
        }
    } catch (error) {
        console.error(error)
    }
})

export default modules