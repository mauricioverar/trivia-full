const pool = require('./pool.js')

// create_table
async function create_table() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists games (
      id serial primary key,
      score int not null ,
      percentage float not null,
      user_id int not null references users(id),
      date timestamp default now()
    )
  `)

  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()

// get_games
async function get_games(name_user) {

  let resp
  
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  if (name_user != undefined) {

    if (name_user == 0) {
      // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
      resp = await client.query(
        `select * from games where id <> 0 order by date desc limit 1`
      )

    } else {
      
      resp = await client.query(
        { text: `select *, name from games left join users on id(users) = user_id(games)  where name(users) = '${name_user}'` }
      )
    }

  } else {

    // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
    resp = await client.query(
      { text: `select *, name from games full join users on id(users) = user_id(games) order by percentage(games) desc` }
    )
  }


  // 3. Devuelvo el cliente al pool
  client.release()

  // 4. retorno el primer usuario, en caso de que exista
  return resp.rows
}

// create_game
async function create_game(score, percentage, user_id) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const resp = await client.query(
    `insert into games (score, percentage, user_id) values ($1, $2, $3) returning *`,
    [score, percentage, user_id]
  )
  // 3. Devuelvo el cliente al pool
  client.release()
  return resp.rows
}

module.exports = { get_games, create_game }