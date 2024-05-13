import bcrypt from 'bcrypt'
import { DataTypes } from 'sequelize';

async function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10, 'a');
    let hashedPassword = await bcrypt.hashSync(password, salt);
    return hashedPassword
    
}


async function isValidPassword(password, hash) {
    return await bcrypt.compareSync(password, hash)
} 

async function defineModel(sequelize, modelName, definitions, options) {
    let localDefinitions = definitions
    localDefinitions.password = {
        type: definitions.password.type,
        get() { return null},
        async set(value) {
            let hashedPassword = await hashPassword(value)
            this.setDataValue("password", hashedPassword)
        }
    }

    localDefinitions.sessionToken = {
        type: DataTypes.STRING(500)
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