const express = require('express')

/* const session = require('express-session')
const pgSession = require('connect-pg-simple')(session) */

const path = require('path') // unir rutas o directorios
const nunjucks = require('nunjucks') // path chokidar
// const flash = require('connect-flash') // alerts

const { env } = require('process')
const secrets = require('./secrets')

const { connectMongoDB } = require('./mongoose')

const {pool2} = require('./db/pool.js')
// const { pool } = require('./pool.js') // pool creado en pool.js

connectMongoDB()


const app = express()
const port = process.env.PORT || 3000 // asignar un puerto para la nube o usar 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))

// se configura uso de sesiones
// https://github.com/voxpelli/node-connect-pg-simple
/* app.use(session({
  store: new pgSession({
    pool: pool2
  }),
  secret: '****',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
})) */

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



// se configura uso de mensajes flash
// app.use(flash())

// rutas
app.use(require('./routes/auth'))
app.use(require('./routes/routes'))

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server

// npm start

// ver detalles de conexion
// heroku logs --tail
