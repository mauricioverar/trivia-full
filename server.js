const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks') // path chokidar

const secrets = require('./secrets')

const app = express()
const port = process.env.PORT || 3000 // asignar un puerto para la nube o usar 3000

// midlewares
// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))

// se configura nunjucks
const nunj_env = nunjucks.configure(path.resolve(__dirname, "templates"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});
nunj_env.addGlobal('app_name', secrets.app_name)

// res api
app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server

// npm start
