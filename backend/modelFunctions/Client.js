import bcrypt from 'bcrypt'

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
        ...definitions.password,
        get() { return null},
        async set(value) {
            if(typeof value == "string" && value.length > 0) {
                let hashedPassword = await hashPassword(value)
                this.setDataValue("password", hashedPassword)
            } else {
                this.setDataValue("password", this._previousDataValues.password)
            }
        }
    }

    localDefinitions.sessionToken = {
        ...localDefinitions.sessionToken,
        get() { return null},
        async set(value) {
            if(typeof value == "string" && value.length > 0) {
                this.setDataValue("sessionToken", value)
            } else {
                this.setDataValue("sessionToken", this._previousDataValues.sessionToken)
            }
        }
    }

    localDefinitions.username = {
        ...localDefinitions.username,
        async set(value) {
            console.log(this.isNewRecord)
            if(this._options.isNewRecord) {
                this.setDataValue("username", value)
            }
        }
    }

    let userModel = await sequelize.define(modelName, localDefinitions, options)

    userModel.prototype.isValidPassword = async (password, hash) => {
        let result = await isValidPassword(password, hash)
        return result
    }

    return userModel
}

export async function updateUserPassword (user, oldPassword, newPassword, confirmNewPassword) {
    let hashedOldPassword = await hashPassword(oldPassword)
    let PasswordValidation = await isValidPassword(hashedOldPassword, user.dataValues.password)
    console.log(user != null , newPassword == confirmNewPassword, PasswordValidation)
    if(
        user != null 
        && newPassword == confirmNewPassword
        && isValidPassword(hashPassword(oldPassword), user.dataValues.password)
    ) {
        await user.setDataValue("password", newPassword)
        await user.save()
    }

    return {user, oldPassword, newPassword, confirmNewPassword}
}


export default { 
    defineModel, updateUserPassword
 }