const { Router } = require('express')
const bcrypt = require('bcrypt')
const { get_user, create_user } = require('../db/users.js')
const { api_users, get_ping } = require('../db/users')
const { get_questions, create_question } = require('../db/questions')
const { get_answer } = require('../db/answers.js')
const { get_games, create_game } = require('../db/games.js')

const router = Router()

let usuario = {
  name: '',
  email: '',
  id: '',
  is_admin: '',
  play: ''
}
let name_us = undefined

// res api
router.get('/api/users', api_users)
router.get('/ping', get_ping)

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {  
  if (!usuario.name) {
    console.log('errors', 'You must log in first')
    return res.redirect('/login')
  }
  next()
}

// index GET
router.get('/', protected_route, async (req, res) => {
  try {
    if (name_us == '' || name_us == 'all') {
      name_us = undefined
    }
    const games = await get_games(name_us)
    const toplay = await get_games(0)    
    console.log('index ',usuario)
    res.render('index.html', {usuario, games, toplay}) // , { games, toplay })
  } catch (error) {
    console.log(error)
  }
})

// ruta que carga el formulario del login
router.get('/login', (req, res) => {
  // const messages = req.flash()
  // res.render('login.html', { messages })
  res.render('login.html')
})

// new_question GET
router.get('/new_question', protected_route, (req, res) => {
  res.render('new_question.html')
})

// ruta que procesa el formulario de Login
router.post('/login', async (req, res) => {
  // 1. me traigo los dat del formulario
  const email = req.body.email.trim()
  const password = req.body.password.trim()

  // 2. intento buscar al usuario en base a su email 
  let user_find = await get_user(email)
  if (!user_find) {
    // req.flash('errors', 'Usuario es inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }

  // 3. verificamos las contraseñas
  const son_coincidentes = await bcrypt.compare(password, user_find.password)
  if (!son_coincidentes) {
    console.log('errors', 'Usuario es inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  
  // PARTE FINAL
  /* usuario = {
    name: user_find.name,
    email: user_find.email,
    id: user_find.id,
    is_admin: user_find.is_admin,
    play: false
  } */
  usuario = {
    name: user_find.name,
    email: user_find.email,
    id: user_find.id,
    is_admin: user_find.is_admin,
    play: false
  }
  console.log('login ',user_find.name)
  return res.redirect('/')  
})

router.get('/logout', (req, res) => {
  usuario = null 
  name_us = undefined
  res.redirect('/login')
})

router.get('/register', (req, res) => {
  // const messages = req.flash()   
  // res.render('register.html', {messages})
  res.render('register.html')
})

// lets_play GET
router.get('/lets_play', protected_route, async (req, res) => {
  try {

    const dat = await get_questions()
    await get_answer(dat)
    res.render('lets_play.html', { dat })

  } catch (error) {
    console.log(error)
  }
})

router.post('/register', async (req, res) => {
  // 1. me traigo los dat del formulario
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const password_repeat = req.body.password_repeat.trim()

  // 2. validamos que contraseñas coincidan
  if (password != password_repeat) {
    // req.flash('errors', 'Las contraseñas no coinciden')
    return res.redirect('/register')
  }
  // 3. validamos que no exista otro usuario con ese mismo correo
  const current_user = await get_user(email)
  if (current_user) {
    // req.flash('errors', 'Ese email ya está ocupado')
    console.log('errors', 'Ese email ya está ocupado')
    return res.redirect('/register')
  }
  // 4. Finalmente lo agregamos a la base de dat
  const encrypted_pass = await bcrypt.hash(password, 10)
  const new_user = await create_user(name, email, encrypted_pass)
  // usuario = { id: new_user.id, name, email }
  // 5. y redirigimos a la ruta principal
  res.redirect('/login')
})

// new_question POST
router.post('/new_question', protected_route, async (req, res) => {
  try {

    if (usuario.is_admin == true) {
      const question = req.body.question.trim()
      const answer_true = req.body.answer_true.trim()
      const false1 = req.body.answer_false1.trim()
      const false2 = req.body.answer_false2.trim()
      const false3 = req.body.answer_false3.trim()
      const false4 = req.body.answer_false4.trim()
      await create_question(question, answer_true, false1, false2, false3, false4)
    }
    res.redirect('/new_question')

  } catch (error) {
    console.log(error)
  }
})

// answers del juego POST
router.post('/lets_play', async (req, res) => {

  let result = 0
  let percentage = 0

  try {
    const question1 = req.body.question1
    const question2 = req.body.question2
    const question3 = req.body.question3

    const user_id = usuario.id
    if (question1 == '1') {
      result++
    }
    if (question2 == '1') {
      result++
    }
    if (question3 == '1') {
      result++
    }

    percentage = ((result * 100) / 3).toFixed(1)
    await create_game(result, percentage, user_id)
    usuario.play = true
    res.redirect('/')

  } catch (error) {
    console.log(error)
  }
})

// /search
router.post('/search', (req, res) => {
  try {

    name_us = req.body.nombre.trim()
    res.redirect('/')

  } catch (error) {
    console.log(error)
  }

})

// 404 GET>
router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router, usuario
