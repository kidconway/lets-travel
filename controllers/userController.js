const User = require('../models/user')
const Hotel = require('../models/hotel')
const Order = require('../models/order')
const Passport = require('passport')


// Express Validator
const { check, validationResult, sanitize } = require('express-validator')


// Query Parse
const querystring = require('querystring')

exports.registerGet = (req, res) => {
  res.render('register', { title: 'Register your account' })
}

exports.registerUser = [
  // Validations
  check('fname').isLength({  min: 1 }).withMessage('First name cannot be blank')
  .isAlphanumeric().withMessage('First Name must be alphanumeric'),

  check('lname').isLength({  min: 1 }).withMessage('Last name cannot be blank')
  .isAlphanumeric().withMessage('Last Name must be alphanumeric'),

  check('email').isEmail().withMessage('Email must be in valid format'),

  check('confirm_email')
  .custom( ( value, { req }) => value === req.body.email )
  .withMessage('Emails do not match'),

  check('password').isLength({ min : 6}).withMessage('Password must be at least 8 characters'),

  check('confirm_password')
  .custom( ( value, { req }) => value === req.body.password )
  .withMessage('Passwords do not match'),

  // Sanitize possibly malicious form data
  sanitize('*').trim().escape(),


  // Request
  (req, res, next) => {
    const errors = validationResult(req)
    if( !errors.isEmpty() ) {
      // Errors
      res.render('register', { title: 'Please fix the following errors:', errors: errors.array() })
      return
    } else {
      const newUser = new User(req.body)
      User.register( newUser, req.body.password, (err) => {
        if(err) {
          console.log('Registration Error', err)
          return next()
        }
        next() // Moves onto loginUser after no errors
      })
    }
  }
]

exports.loginGet = (req, res) => {
  res.render('login', { title: 'Please login' })
}

exports.loginUser = Passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You are now logged in',
  failureRedirect: '/login',
  failureFlash: 'Login failed, please check your credentials and try again'
})

exports.logoutUser = (req, res) => {
  req.logout()
  req.flash('info', 'You are now logged out.')
  res.redirect('/')
}

exports.myAccount = async (req, res, next) => {
  try{
    if (!req.user.id) {
      res.render('login')
    }
    const orders = await Order.aggregate([
      { $match: { user_id: req.user.id } },
      { $lookup: {
        from: 'hotels',
        localField: 'hotel_id',
        foreignField: '_id',
        as: 'hotel_data'
      }}
    ])
    res.render('user-account', { title: 'User Account Details', orders })
  } catch(err){
    next(err)
  }
}

exports.isAdmin = (req, res, next) => {
  if( req.isAuthenticated() && req.user.isAdmin ) {
    next()
    return
  }
  res.redirect('/')
}

exports.bookingConfirmation = async (req, res, next) => {
  try {
    const data = req.params.data
    const searchData = querystring.parse(data)
    const hotel = await Hotel.find({ _id: searchData.id })

    res.render('booking-confirmation', { title: 'Please confirm details of your adventure', searchData, hotel })
  } catch(err) {
    next(err)
  }
}

exports.confirmmationPage = async (req, res, next) => {
  try {
    const data = req.params.data
    const confirmData = querystring.parse(data)
    const order = new Order({
      user_id: req.user._id,
      hotel_id: confirmData.id,
      order_details: {
        duration: confirmData.duration,
        departureDate: confirmData.departureDate,
        numberGuests: confirmData.numberGuests
      }
    })
    await order.save()
    // No email is sent
    req.flash('info', 'Your order has been placed!  A confirmation has been sent to your inbox.')
    res.redirect('/user-account')
  } catch(err){
    next(err)
  }
}

exports.allOrders = async (req, res, next) => {
  try{
    if (!req.user.id) {
      res.render('login')
    }
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'hotels',
          localField: 'hotel_id',
          foreignField: '_id',
          as: 'hotel_data'
      }}
    ])
    res.render('orders', { title: 'All Orders', orders })
  } catch(err){
    next(err)
  }
}
