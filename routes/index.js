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
  editRemovePost,
  updateHotelGet,
  updateHotel,
  deleteHotelGet,
  deleteHotel,
  hotelDetail,
  countryDetail,
  upload,
  pushToCloudinary,
  searchResults
} = require('../controllers/hotelController')


router.get('/', homePageFilters)
router.get('/all', listAllHotels)
router.get('/all/:id', hotelDetail)
router.get('/countries', listAllCountries)
router.get('/countries/:country', countryDetail)

router.post('/results', searchResults)

// Admin Routes
router.get('/admin', adminPage)
router.get('/admin/add', createHotelGet)
router.post('/admin/add', upload, pushToCloudinary, createHotelPost)
router.get('/admin/edit-remove', editRemoveGet)
router.post('/admin/edit-remove', editRemovePost)
router.get('/admin/:id/update', updateHotelGet)
router.post('/admin/:id/update', upload, pushToCloudinary, updateHotel)
router.get('/admin/:id/delete', deleteHotelGet)
router.post('/admin/:id/delete', deleteHotel)


module.exports = router
