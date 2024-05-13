async function defineModel(sequelize, modelName, definitions, options) {
    return sequelize.define(modelName, definitions, options)
}

export default { 
    defineModel
 }