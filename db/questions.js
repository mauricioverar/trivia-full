const pool = require('./pool.js')

async function create_table () {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists questions (
      id serial primary key,
      question varchar(255) not null,
      answer_true varchar(255) not null,
      answer_false1 varchar(255) not null,
      answer_false2 varchar(255) not null,
      answer_false3 varchar(255),
      answer_false4 varchar(255)
    )
  `)
  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()


async function get_questions () {
  
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const answer = await client.query({
    text: `select * from questions order by random() limit 3`     
  })  
  // 3. Devuelvo el cliente al pool
  client.release()  
  // 4. retorno questions, en caso de que exista
  return answer.rows
}

async function create_question (question, answer_true, false1, false2, false3, false4) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const { rows } = await client.query(
    `insert into questions (question, answer_true, answer_false1, answer_false2, answer_false3, answer_false4) values ($1, $2, $3,$4, $5, $6) returning *`,
    [question, answer_true, false1, false2, false3, false4]
  )
  // 3. Devuelvo el cliente al pool
  client.release()
  return rows[0]
}

module.exports = { get_questions, create_question }

