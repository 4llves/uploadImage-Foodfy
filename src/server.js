const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')//para poder utilizar o PUT e o DELETE

const server = express()

server.set('view engine', 'njk')

server.use(express.urlencoded({ extended: true })) // use é um "middlewares" algo que vai interceptar algo entra o ponto A e B --- e esta linha é a responsavel pelo funcionamento do body
server.use(express.static('public'))
server.use(methodOverride('_method'))//configuração de methodOverride com parametro tipo string '_method'
server.use(routes)/*atenção na ordem do codigo no server pois ele segue a ordem... no caso vem o methodOverride
antes de ser o 'routes'*/


nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5001, function() {
    console.log('Server is Running')
})