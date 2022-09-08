const mongoose = require('mongoose')
// variable de entorno para servidor(dotenv)
require('dotenv').config() // npm i dotenv

const uri = process.env.MONGODB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(uri) // basedato nube mongodb
    console.log('Mongodb conectada')
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connectDB }