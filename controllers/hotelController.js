const Hotel = require('../models/hotel')

exports.homePage = (req, res) => {

  res.render('index', { title: 'Lets travel' })
}

exports.listAllHotels = (req, res) => {

  res.render('all-hotels', { title: 'All Hotels' })
}

exports.adminPage = (req, res) => {
  res.render('admin', { title: 'Admin Page' })
}


exports.createHotelGet = (req, res) => {
  res.render('add-hotel', { title: 'Add New Hotel'} )
}

exports.createHotelPost = async (req, res, next) => {
  try {
    const hotel = new Hotel(req.body)
    await hotel.save()
    res.redirect(`/all/${hotel._id}`)
  } catch(error) {
    next(error)
  }
}
