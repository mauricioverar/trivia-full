const { Router } = require('express')
const { get_questions, create_question } = require('../../Trivia/db/questions.js')
const { get_games, create_game } = require('../../Trivia/db/games.js')
const { get_answer } = require('../../Trivia/db/answers.js')

const router = Router()

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'You must log in first')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user
  // finalmente, seguimos el camino original
  next()
}


// index GET
router.get('/', protected_route, async (req, res) => {

  req.session.user
  req.session.name_us

  try {

    if (req.session.name_us == '' || req.session.name_us == 'all') {
      req.session.name_us = undefined
    }
    const games = await get_games(req.session.name_us)

    const toplay = await get_games(0)

    
    res.render('index.html', { games, toplay })

  } catch (error) {
    console.log(error)
  }

})


// new_question GET
router.get('/new_question', protected_route, (req, res) => {
  res.render('new_question.html')
})


// new_question POST
router.post('/new_question', protected_route, async (req, res) => {
  try {

    if (req.session.user.is_admin == true) {
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

// answers del juego POST
router.post('/lets_play', async (req, res) => {

  let result = 0
  let percentage = 0

  try {
    const question1 = req.body.question1
    const question2 = req.body.question2
    const question3 = req.body.question3

    const user_id = req.session.user.id
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
    req.session.user.play = true
    res.redirect('/')

  } catch (error) {
    console.log(error)
  }
})

// /search
router.post('/search', (req, res) => {
  try {

    req.session.name_us = req.body.nombre.trim()
    res.redirect('/')

  } catch (error) {
    console.log(error)
  }

})

// 404 GET>
router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;