require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const compression = require('compression')
const helmet = require('helmet')

const app = express()


// basic production
app.use(helmet());

const indexRouter = require('./routes/index')

// compress responses
app.use(compression())

// passport.js
const User = require('./models/user')
const passport = require('passport')

// For sessions
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Flash Messages
const flash = require('connect-flash')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Configure passport middleware
app.use( passport.initialize() )
app.use( passport.session() )

// Flash Messages
app.use( flash() )

passport.use( User.createStrategy() )

passport.serializeUser( User.serializeUser() )
passport.deserializeUser( User.deserializeUser() )

// Custom Middleware
app.use( (req, res, next) => {
  // console.log(`The Current path is ${req.path}`)
  res.locals.user = req.user
  res.locals.url = req.path
  res.locals.flash = req.flash()
  next()
})

// Set up Mongoose connection
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DB, { useNewUrlParser: true })
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

const port = process.env.PORT || 3000;
app.listen(port);

module.exports = app
