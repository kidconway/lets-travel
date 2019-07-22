const Hotel = require('../models/hotel')

// exports.homePage = (req, res) => {
//
//   res.render('index', { title: 'Lets travel' })
// }

exports.listAllHotels = async (req, res, next) => {
  try {
    const allHotels = await Hotel.find({
      available: { $eq: true }
    })

    res.render('all-hotels', { title: 'All Hotels', allHotels })
  } catch(errors) {
    next(errors)
  }
}

exports.listAllCountries = async (req, res, next) => {
  try {
    const allCountries = await Hotel.distinct('country')

    res.render('all-countries', { title: 'Browse by Country', allCountries })
  } catch(errors) {
    next(errors)
  }
}

exports.homePageFilters = async (req, res, next ) => {
  try {
    const hotels = await Hotel.aggregate([
      { $match: { available: true } },
      { $sample: { size: 9 } }
    ])
    const countries = await Hotel.aggregate([
      { $group: { _id: '$country'} },
      { $sample: { size: 9 }}
    ])
    res.render('index', { hotels, countries })
  } catch(err) {
    next(err)
  }
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

exports.editRemoveGet = (req, res) => {
  res.render('edit-remove', {title: 'Search for Hotel to Edit or Remove'})
}

exports.editRemovePost = async (req, res, next ) => {
  try {
    console.log(req.body)
    const hotelId = req.body.hotel_id || null;
    const hotelName = req.body.hotel_name || null;

    const hotelData = await Hotel.find({ $or: [
      { _id: hotelId },
      { hotel_name: hotelName }
    ]}).collation({
      locale: 'en',
      strength: 2
    })

    hotelData.length > 0 ? res.render('hotel-detail', { title: 'Add / Remove Hotel', hotelData }) : res.redirect('/admin/edit-remove')

  } catch(err) {
    next(err)
  }
}
