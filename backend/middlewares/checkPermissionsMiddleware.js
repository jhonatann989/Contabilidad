import JWTHandler from './../helperFunctions/JWTHandler.js'


async function checkPermissionsMiddleware(models, req, res, next) {
    let wildUrls = ["/login", "/logout"]
    let crudVerbs = {
      POST: "Create",
      GET: "Read",
      PUT: "Update",
      DELETE: "Delete"
    }
    
    if (wildUrls.includes(req.url)) { return next() }
  
    let token = req.headers["authorization"]?.replace("Bearer ", "")
    if( !Boolean(JWTHandler.verifyJWT(token)) ) { 
      return res.status(403).send(ErrorHandlers.helperRequestErrorGenerator(403, "Invalid Token"))
    }
    let {username} = JWTHandler.decodeJWT(token)
    let authenticatedUser = await models.Client.findOne({ where: { username } })
  
    if(authenticatedUser == null) {
      return res.status(403).send(ErrorHandlers.helperRequestErrorGenerator(403, "The user associated to this token is invalid"))
    }
    
    let permissions = await models.UserPermission.findOne({
      where: {
        id: authenticatedUser.id,
        module: req.url.split("/").pop(),
        [crudVerbs[req.method]]: true
      }
    })
  
    if(permissions == null) {
      return res.status(403).send(ErrorHandlers.helperRequestErrorGenerator(403, "User cannot perform this action"))
    }
  
    next()
}

export default checkPermissionsMiddleware