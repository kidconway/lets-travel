const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index')

const app = express()

const { adminUsername, adminPassword } = require('./secrets/db_config')



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// handling local variables
app.use( (req, res, next) => {
  console.log(`The Current path is ${req.path}`)
  res.locals.url = req.path
  next()
})

// Set up Mongoose connection
mongoose.connect(`mongodb://${adminUsername}:${adminPassword}@cluster0-shard-00-00-dvkmz.mongodb.net:27017,cluster0-shard-00-01-dvkmz.mongodb.net:27017,cluster0-shard-00-02-dvkmz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`)
mongoose.Promise = global.Promise
mongoose.connection.on('error', error => console.error(error.message))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404))
})

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
