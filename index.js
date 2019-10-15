const express = require('express')

const server = express()

server.use(express.json())

// Query params = ?teste=1
//Routes params = /users/1

const users = ['Matheus', 'Lucas', 'Thiago']

/*
server.get('/users', (req, res) => {
  const {nome} = req.query

  return res.json({message : `Hello ${nome}`})
})
*/

//middleare global => Pega o tempo de execução da req. feita
server.use((req, res, next) => {
  console.time('Request')
  console.log(`Metodo: ${req.method} ; URL: ${req.url}`);
  next()
  console.timeEnd('Request')
})

//middleware de verificação de name
function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({error: 'User name is required'})
  }
  return next()
}

//middlware de verificação de index
function checkUserIndex(req, res, next){
  const user = users[req.params.index]
  if(!user){
    return res.status(404).json({error: 'User not located'})
  }

  req.user = user

  return next()
}

server.get('/users', (req, res) => {
  return res.json(users)
})

server.get('/users/:index', checkUserIndex, (req, res) => {
  return res.json(req.user) // req.user passado pelo middleware
})

server.post('/users', checkUserExists, (req, res) => {
  const {name} = req.body
  users.push(name)
  return res.json(users)
})

server.put('/users/:index', checkUserIndex, checkUserExists, (req, res) => {
  const { name } = req.body
  const { index } = req.params

  users[index] = name

  return res.json(users)
})

server.delete('/users/:index', checkUserIndex, (req, res) => {
  const { index } = req.params

  users.splice(index, 1)

  return res.send({message : `User ${index} deleted`})
})

server.listen(3000)
