import fs from 'fs'
import { Sequelize, DataTypes } from 'sequelize'
import server from './../configs/server.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import getModelDefiner from '../modelFunctions/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url));
const sequelize = new Sequelize(
    server.database,
    server.username,
    server.password,
    server
);

let rawModelObj = []
let models = {}

//Reading file Models
for(let file of fs.readdirSync(`${__dirname}`)) {
    let filename = file.split(".")
    try {
        if (filename[1] == "json") {
            rawModelObj.push({
                modelName: filename[0],
                modelData: JSON.parse(fs.readFileSync(`${__dirname}/${file}`))
            })
        }
    } catch (error) {
        console.error("++++++++++")
        console.error("error Reading file Models")
        console.error(error)
        console.error("----------")
    }
}

//Initializing models 
for(let rawModel of rawModelObj) {
    try {
            let {modelName, modelData} = rawModel
            let fieldsDefinitionKeys = Object.keys(modelData.fieldsDefinition)
            for(let fieldKey of fieldsDefinitionKeys) {
                let genericFieldType = modelData.fieldsDefinition[fieldKey].type
                modelData.fieldsDefinition[fieldKey].type = DataTypes[genericFieldType]
            }
            
            let { defineModel } = await getModelDefiner(modelName)
            models[modelName] = await defineModel(sequelize, modelName, modelData.fieldsDefinition, {tableName: modelName})

    } catch (error) {
        console.error("++++++++++")
        console.error("error Initializing models", rawModel.modelName)
        console.error(error)
        console.error("----------")
    }
}

//Define Associations
for(let rawModel of rawModelObj) {
    try {
            let {modelName, modelData} = rawModel
            /**Associations */
            for(const association of modelData.associations ) {
                try {
                    models[modelName][association.relationType](models[association.relationModel])
                }
                catch(error) {
                    console.error("++++++++++")
                    console.error("error Define Associations", rawModel.modelName)
                    console.error(error)
                    console.error("----------")
                }
            }
            
    } catch (error) {
        console.error("++++++++++")
        console.error("error Define Associations/hooks/prototypes")
        console.error(error)
        console.error("----------")
    }
}


export default { sequelize, models,  }