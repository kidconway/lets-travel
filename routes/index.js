const { Router } = require('express')
const router = Router()

const {
  homePageFilters,
  listAllHotels,
  adminPage,
  createHotelGet,
  createHotelPost,
  listAllCountries,
  editRemoveGet,
  editRemovePost
} = require('../controllers/hotelController')

// Get all day
router.get('/', homePageFilters)
router.get('/all', listAllHotels)
router.get('/countries', listAllCountries)

//Get all



// Admin Routes
router.get('/admin', adminPage)
router.get('/admin/add', createHotelGet)
router.post('/admin/add', createHotelPost)
router.get('/admin/edit-remove', editRemoveGet)
router.post('/admin/edit-remove', editRemovePost)

module.exports = router
