const express = require('express')
const path = require('path') // unir rutas o directorios
const nunjucks = require('nunjucks') // path chokidar
const flash = require('connect-flash') // alerts
const { env } = require('process')
const { connectDB } = require('./db')
const User = require('./models/users')

connectDB()

const secrets = require('./secrets')

const app = express()
const port = process.env.PORT || 3000 // asignar un puerto para la nube o usar 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))

// se configura nunjucks
const nunj_env = nunjucks.configure(path.resolve(__dirname, "views"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});
nunj_env.addGlobal('app_name', secrets.app_name)

// con ejs sería
/*
const ejs = require('ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
*/

// ruta index
app.get('/', (req, res) => {
  res.render('index.html')
})

// res api
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
  // res.json([{name: 'us1'}, {name: 'us2'}])
})

// se configura uso de mensajes flash
app.use(flash())

// rutas
/* app.use(require('./routes/auth'))
app.use(require('./routes/routes')) */

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server

// npm start

// ver detalles de conexion
// heroku logs --tail