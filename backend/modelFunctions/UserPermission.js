import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function defineModel(sequelize, modelName, definitions, options) {
    let ModuleNames = []
    for(let file of fs.readdirSync(path.join(__dirname, "..", "models"))) {
        let filename = file.split(".")
        try {
            if (filename[1] == "json") {
                ModuleNames.push(filename[0])
            }
        } catch (error) {
            console.error("++++++++++")
            console.error("error Reading file Models")
            console.error(error)
            console.error("----------")
        }
    }
    let localDefinitions = definitions
    localDefinitions.module = {
        ...localDefinitions.module,
        isIn: [ModuleNames],
    }

    let userModel = await sequelize.define(modelName, localDefinitions, options)

    userModel.prototype.isValidPassword = async (password, hash) => {
        let result = await isValidPassword(password, hash)
        return result
    }

    return userModel
}


export default { 
    defineModel
 }