const { Router } = require('express')
const router = Router()

const {
  homePage,
  listAllHotels,
  adminPage,
  createHotelGet,
  createHotelPost, 
  listAllCountries
} = require('../controllers/hotelController')

// Get all day
router.get('/', homePage)
router.get('/all', listAllHotels)
router.get('/countries', listAllCountries)

//Get all



// Admin Routes
router.get('/admin', adminPage)
router.get('/admin/add', createHotelGet)
router.post('/admin/add', createHotelPost)

module.exports = router
