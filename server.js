const express = require('express')

const app = express()
const port = process.env.PORT || 3000 // asignar un puerto para la nube o usar 3000

// midlewares
// se configuran archivos estáticos
app.use(express.static('public'))

// res api
app.get('/api//users', (req, res) => res.json([{name: 'rows'}, {name: 'rut'}]))

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server

// npm start
