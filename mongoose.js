const mongoose = require('mongoose')
// variable de entorno para servidor(dotenv)
require('dotenv').config() // npm i dotenv

const uri = process.env.MONGODB_URL

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri || 'mongodb://localhost/testdb') // basedato nube mongodb (produccion) ó conectarse localmente a basedatos testdb (desarrollo)
    console.log('Mongodb conectada')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connectMongoDB }