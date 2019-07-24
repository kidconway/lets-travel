const Hotel = require('../models/hotel')
const cloudinary = require('cloudinary').v2
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  cloud_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Handles pushing to Cloudinary using multer middleware
const storage = multer.diskStorage({})
const upload = multer({ storage })
exports.upload = upload.single('image')
exports.pushToCloudinary = (req, res, next) => {
  if(req.file) {
    cloudinary.uploader.upload(req.file.path)
    .then( result => {
      req.body.image = result.public_id
      next()
    })
    .catch( err => {
      res.redirect('/admin/add')
    })
  } else {
    next()
  }
}

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
    console.log(process.env.DB_HOST)
    const hotels =  Hotel.aggregate([
      { $match: { available: true } },
      { $sample: { size: 4 } }
    ])
    const countries =  Hotel.aggregate([
      { $group: { _id: '$country'} },
      { $sample: { size: 8 }}
    ])
    const [ filteredCountries, filteredHotels ] = await Promise.all([ countries, hotels ])
    res.render('index', { filteredCountries, filteredHotels })
  } catch(err) {
    next(err)
  }
}

exports.countryDetail = async (req, res, next) => {
  try {
    const countryId = req.params.country
    const countries = await Hotel.find({ country: countryId})
    res.render('hotels-country', { title: `Browse by country: ${countryId}`, countries})
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

exports.hotelDetail = async (req, res, next) => {
  try {
    const hotelData = await Hotel.find({ _id: req.params.id})

    res.render(`hotel-detail`, { title: 'Lets Travel', hotelData} )
  } catch(err) {
    next(err)
  }
}

exports.editRemoveGet = (req, res) => {
  res.render('edit-remove', {title: 'Search for Hotel to Edit or Remove'})
}

exports.editRemovePost = async (req, res, next ) => {
  try {
    console.log(req.body)
    const hotelId = req.body.hotel_id || null
    const hotelName = req.body.hotel_name || null

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

exports.updateHotelGet = async (req, res, next) => {
  try {
    const id = req.params.id
    const hotel = await Hotel.findOne({ _id: id})

    res.render('add-hotel', { title: 'Update Hotel', hotel})
  } catch(err) {
    next(err)
  }
}

exports.updateHotel = async (req, res, next) => {
  try {
    const id = req.params.id
    const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true })
    res.redirect(`/all/${id}`)
  } catch(err) {
    next(err)
  }
}

exports.deleteHotelGet = async (req, res, next) => {
  try {
    const id = req.params.id
    const hotel = await Hotel.findOne({ _id: id})
    res.render('add-hotel', { title: 'Delete Hotel', hotel} )
  } catch(err) {
    next(err)
  }
}

exports.deleteHotel = async (req, res, next) => {
  try {
    const id = req.params.id
    const hotel = await Hotel.findByIdAndRemove({ _id: id })
    res.redirect('/')
  } catch(err) {
    next(err)
  }
}
