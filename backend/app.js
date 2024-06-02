import './configs/initEnv.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import fileUpload from 'express-fileupload';
import { v4 } from 'uuid'
import cors from 'cors'
import fs from 'fs'
import modelEntity from './models/index.js';
import { crud } from 'express-crud-router'
import ErrorHandlers from './helperFunctions/ErrorHandlers.js'
import JWTHandler from './helperFunctions/JWTHandler.js'
import checkPermissionsMiddleware from './middlewares/checkPermissionsMiddleware.js';
import { updateUserPassword } from './modelFunctions/Client.js'

const port = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const { models, sequelize, modelAssociations } = modelEntity

const app = express()

app.use(cors({ origin: 'http://localhost:5173', }))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static('static'));
app.use(fileUpload());

/** post routes middleware **/
app.use((err, req, res, next) => {
  console.error('ERROR2022: ', err);

  res.status(500).json({ error: true, message: err.message });
  next();
});

app.use((req, res, next) => checkPermissionsMiddleware(models, req, res, next))

/**
 * Auth
 */
app.post('/login', async function (req, res) {
  let { username, password } = req.body
  let authenticatedUser = await models.Client.findOne({ where: { username } })
  console.log(authenticatedUser.dataValues)
  if (authenticatedUser !== null && !await authenticatedUser.isValidPassword(password, authenticatedUser.dataValues.password)) {
    res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401, "Incorrect Username or Password"))
  } else if (authenticatedUser == null) {
    res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401, "Invalid Username"))
  } else {
    let permissions = await models.UserPermission.findAll({
      where: {
        ClientId: authenticatedUser.id
      }
    })
    let token = JWTHandler.generateJWT({ username: authenticatedUser.username })
    await models.Client.update({ sessionToken: token }, { where: { username: username } })
    let output = JSON.parse(JSON.stringify(authenticatedUser))
    output.sessionToken = token
    res.status(200).send({ userdata: output, permissions })
  }

});

app.get("/identity", async (req, res) => {
  let token = req.header("Authorization")?.replace("Bearer ", "")
  if (!JWTHandler.verifyJWT(token)) {
    return res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401))
  }
  let decodedData = JWTHandler.decodeJWT(token)
  let authenticatedUser = await models.Client.findOne({
    where: { username: decodedData.username }
  })

  if (authenticatedUser === null) {
    res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401, "Unknown User"))
  } else {
    res.status(200).send({
      fullName: authenticatedUser.get("username")
    })
  }
})

app.get("/logout", async (req, res) => {
  let token = req.header("Authorization")?.replace("Bearer ", "")
  if (!JWTHandler.verifyJWT(token)) {
    return res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401))
  }
  let decodedData = JWTHandler.decodeJWT(token)
  let authenticatedUser = await models.Client.findOne({
    where: { username: decodedData.username }
  })

  if (authenticatedUser === null) {
    res.status(500).send(ErrorHandlers.helperRequestErrorGenerator(500, "User does not exist"))
  } else {

    await models.Client.update({ sessionToken: null }, { where: { username: decodedData.username } })
    res.status(200).send(ErrorHandlers.helperRequestSuccessMessageGenerator(200))
  }
})

/**CRUD Handler */
for (const modelName of Object.keys(models)) {
  app.use(crud(`/${modelName}`, {
    get: ({ filter, limit, offset, order }) => {
      let childModels = []
      let targetRelations = ["hasOne", "hasMany"]

      for (let association of modelAssociations[modelName]) {
        if (targetRelations.includes(association.relationType) && association.childHandle.read) {
          childModels.push(models[association.relationModel])
        }
      }

      return childModels.length ?
        models[modelName].findAndCountAll({ limit, offset, order, where: filter, include: childModels })
        :
        models[modelName].findAndCountAll({ limit, offset, order, where: filter })
    },
    create: async body => {
      let createdData = await models[modelName].create(body)
      for (let association of modelAssociations[modelName]) {
        if (body.hasOwnProperty(`${association.relationModel}s`) && association.childHandle.create) {
          if (association.relationType == "hasMany") {
            for (let child of body[`${association.relationModel}s`]) {
              let createdChild = await models[association.relationModel].create(child)
              await createdData[`add${association.relationModel}`](createdChild)
            }
          } else if (association.relationType == "hasOne") {
            await models[modelName][`create${association.relationModel.slice(0, -1)}um`](body[`${association.relationModel}`])
          }

        }
      }
      return createdData
    },
    update: async (id, body) => {
      let updatedData = await models[modelName].update(body, { where: { id } })
      for (let association of modelAssociations[modelName]) {
        if (body.hasOwnProperty(`${association.relationModel}s`) && association.childHandle.update) {
          // await models[association.relationModel].destroy({ where: { [`${modelName}Id`]: id } })
          if (association.relationType == "hasMany") {
            for (let child of body[`${association.relationModel}s`]) {
              await models[association.relationModel].update(child, { where: { [`${modelName}Id`]: id } })
              // let createdChild = await models[association.relationModel].create(child)
              // await createdData[`add${association.relationModel}`](createdChild)
            }
          } else if (association.relationType == "hasOne") {
            await models[association.relationModel].update(body[`${association.relationModel.slice(0, -1)}um`], { where: { [`${modelName}Id`]: id } })
            // let createdChild = await models[association.relationModel].create(body[`${association.relationModel}`])
            // await createdData[`create${association.relationModel}`](createdChild)
          }

        }
      }
      return updatedData
    },
    destroy: async id => {
      for (let association of modelAssociations[modelName]) {
        if (association.childHandle.delete) {
          await models[association.relationModel].delete({ where: { [`${modelName}Id`]: id } })
        }
      }
      return models[modelName].destroy({ where: { id } })
    },
  }))
}

/**
 * Files Handlers
 */
app.get('/static/:filename', function (req, res) {
  const file = `${__dirname}/static/${req.params.filename}`;
  res.download(file); // Set disposition and send it.
});

app.post("/static/upload", (req, res) => {
  let upfile = req.files.file
  console.log(upfile)
  let extension = upfile.name.split(".").pop()
  let updest = `static/${upfile.name}`;

  if (upfile.name.includes("create-uuid")) {
    updest = `static/${v4.uuidv4()}.${extension}`;
  }
  upfile.mv(`${__dirname}/${updest}`, err => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({
      "errno": 0,
      "code": "",
      "syscall": "",
      "path": updest
    });
  })
})

app.delete('/static/:filename', function (req, res) {
  const file = `${__dirname}/static/${req.params.filename}`;
  if (fs.existsSync(file)) {
    fs.unlink(file, err => {
      if (err) {
        console.error(err)
        res.status(500).send({ msg: "could not delete file" })
      }
      res.status(200).send({ msg: "deleted successfully" })
    })
  }
  res.download(file); // Set disposition and send it.
});

app.get('/', async (req, res) => {
  res.send("Hello World!")
})

app.all('*', async (req, res) => {
  res.status(404).send({ status: "Error", message: "route not found in server" })
})

sequelize.sync({ force: true }).then(() => {
  app.listen(port, async () => {
    console.log(`App listening on port ${port}`)

    let clientPermission = await models.UserPermission.findOne({ where: { module: "Client" } })
    if (clientPermission == null) {
      clientPermission = await models.UserPermission.create({
        module: "Client", Create: true, Read: true, Update: true, Delete: true
      })
    }

    let clientDataPermission = await models.UserPermission.findOne({ where: { module: "ClientData" } })
    if (clientDataPermission == null) {
      clientDataPermission = await models.UserPermission.create({
        module: "ClientData", Create: true, Read: true, Update: true, Delete: true
      })
    }

    let userPermission = await models.UserPermission.findOne({ where: { module: "UserPermission" } })
    if (userPermission == null) {
      userPermission = await models.UserPermission.create({
        module: "UserPermission", Create: true, Read: true, Update: true, Delete: true
      })
    }

    let admin = await models.Client.findOne({
      where: { username: process.env.DEFAULT_USER_USERNAME }
    })

    if (admin == null) {
      admin = await models.Client.create({
        username: process.env.DEFAULT_USER_USERNAME,
        password: process.env.DEFAULT_USER_PASSWORD,
        sessionToken: ""
      })

      await admin.createClientDatum({
        idNumber: 1232400204,
        idType: "CC",
        fullName: "Jhonatan Rodolfo Morales Carrillo",
        address: "Calle 14 sur #126-D7-1 llanitos los patios"
      })

      await admin.addUserPermission(clientPermission)
      await admin.addUserPermission(clientDataPermission)
      await admin.addUserPermission(userPermission)

      // updateUserPassword(admin, "oldPassword", "newPassword", "confirmNewpassword")
    }

  })
})