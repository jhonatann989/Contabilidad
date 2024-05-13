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

const port = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const { models, sequelize } = modelEntity

const app = express()

app.use(cors({ origin: 'http://localhost:3000', }))

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

app.use((req, res, next) => {
  let wildUrls = ["/login", "/logout"]
  if (!wildUrls.includes(req.url)) {
    if(
      JWTHandler.verifyJWT(req.header("Authorization")?.replace("Bearer ", ""))
    ) { next() }
    else {
      res.status(403).send(ErrorHandlers.helperRequestErrorGenerator(403))
    }
  } else { next() }
})

/**
 * Auth
 */
app.post('/login', async function (req, res) {
  let { username, password } = req.body
  let authenticatedUser = await models.Client.findOne({ where: { username } })
  if (authenticatedUser !== null && !await authenticatedUser.isValidPassword(password, authenticatedUser.dataValues.password)) {
    res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401, "Incorrect Username or Password"))
  } else {
    let token = JWTHandler.generateJWT({username: authenticatedUser.username})
    await models.Client.update({ sessionToken: token }, { where: { username: username} })
    authenticatedUser.set("token", token)
    res.status(200).send(authenticatedUser)
  }

});

app.get("/identity", async (req, res) => {
  let decodedData = JWTHandler.decodeJWT(req.header("Authorization")?.replace("Bearer ", ""))
  let authenticatedUser = await models.Client.findOne({
    where: { username: decodedData.username },
    attributes: { exclude: ["password", "sessionToken", "createdAt", "updatedAt", "id"] }
  })

  if (authenticatedUser === null) {
    res.status(401).send(ErrorHandlers.helperRequestErrorGenerator(401, "Unknown User"))
  } else {
    res.status(200).send({
      fullName: authenticatedUser.get("username"),
    })
  }
})

/**CRUD Handler */
for (const modelName of Object.keys(models)) {
  app.use(crud(`/${modelName}`, {
    get: ({ filter, limit, offset, order }) =>
      models[modelName].findAndCountAll({ limit, offset, order, where: filter }),
    create: body => models[modelName].create(body),
    update: (id, body) => models[modelName].update(body, { where: { id } }),
    destroy: id => models[modelName].destroy({ where: { id } }),
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

app.get('/builder/:newModelName', async (req, res) => {
  let modelName = req.params.newModelName
  try {
    let model = JSON.parse(fs.readFileSync(`${__dirname}/models/${modelName}.json`))
    res.send(model)
  } catch (error) {
    console.error(error)
    if (error.code == 'ENOENT') {
      res.status(404).send({ error: `No model found with name ${modelName}` })
    } else {
      res.status(500).send({ error: error.message })
    }
  }
})

app.all('*', async (req, res) => {
  res.status(404).send({ status: "Error", message: "route not found in server" })
})

sequelize.sync({alter: true}).then(() => {
  app.listen(port, async () => {
    console.log(`App listening on port ${port}`)
    let users = await models.Client.findOne({
      where: {
        username: process.env.DEFAULT_USER_USERNAME,
        role: "owner"
      }
    })
    if (users == null) {
      console.log(users)
      await models.Client.create({
        username: process.env.DEFAULT_USER_USERNAME,
        password: process.env.DEFAULT_USER_PASSWORD,
        role: "owner",
        idNumber: 0,
        idType: "",
        fullName: process.env.DEFAULT_USER_NAME,
        address: "",
        sessionToken: ""
      })
    }
  })
})