import jwt from 'jsonwebtoken'

function generateJWT(dataToSign) {
    return jwt.sign(dataToSign, process.env.SECRET, { expiresIn: process.env.SESSION_VALIDITY })
}

function verifyJWT(token) {
    let decoded = decodeJWT(token)
    return decoded != null
}

function decodeJWT(token) {
    try {
        return jwt.verify(token, process.env.SECRET)
    } catch (error) {
        console.log(error.message)
        return null
    }
}
export default { 
    generateJWT,
    verifyJWT,
    decodeJWT
 }