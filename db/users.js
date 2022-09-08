const pool = require('./pool.js')

async function create_table() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists users (
      id serial primary key,
      name varchar(255) not null,
      email varchar(255) not null unique,
      password varchar(255) not null,
      is_admin boolean not null default false
    )
  `)
  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()

async function get_user(email) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const { rows } = await client.query(
    `select * from users where email=$1`,
    [email]
  )
  // 3. Devuelvo el cliente al pool
  client.release()

  // 4. retorno el primer usuario, en caso de que exista
  return rows[0]
}

async function create_user(name, email, password) {

  let resp

  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  const cant_users = await client.query('select * from users')
  
  if (cant_users.rows == 0) {
    resp = await client.query(
      `insert into users (name, email, password, is_admin) values ($1, $2, $3, 'true') returning *`,
      [name, email, password]
    )
  } else {
    resp = await client.query(
      `insert into users (name, email, password, is_admin) values ($1, $2, $3, 'false') returning *`,
      [name, email, password]
    )
  }
  // 3. Devuelvo el cliente al pool
  client.release()  
  return resp.rows[0]
}

// module.exports = { get_user, create_user }

