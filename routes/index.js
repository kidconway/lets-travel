const { Router } = require('express')
const router = Router()

// Hotel Controller
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
  searchResults,
  fileNotFound
} = require('../controllers/hotelController')


// User Controller
const {
  registerGet,
  registerUser,
  loginGet,
  loginUser,
  logoutUser,
  isAdmin,
  bookingConfirmation,
  confirmmationPage,
  myAccount,
  allOrders
} = require('../controllers/userController')


router.get('/', homePageFilters)
router.get('/all', listAllHotels)
router.get('/all/:id', hotelDetail)
router.get('/countries', listAllCountries)
router.get('/countries/:country', countryDetail)
// router.get('*', fileNotFound)

router.post('/results', searchResults)

// User Routes
router.get('/register', registerGet)
router.post('/register', registerUser, loginUser)
router.get('/login', loginGet)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/confirmation/:data', bookingConfirmation)
router.get('/order-placed/:data', confirmmationPage)
router.get('/user-account/', myAccount)

// Admin Routes
router.get('/admin', isAdmin, adminPage)
router.get('/admin/*', isAdmin)
router.get('/admin/add', createHotelGet)
router.post('/admin/add', upload, pushToCloudinary, createHotelPost)
router.get('/admin/edit-remove', editRemoveGet)
router.post('/admin/edit-remove', editRemovePost)
router.get('/admin/:id/update', updateHotelGet)
router.post('/admin/:id/update', upload, pushToCloudinary, updateHotel)
router.get('/admin/:id/delete', deleteHotelGet)
router.post('/admin/:id/delete', deleteHotel)
router.get('/admin/orders', allOrders)



module.exports = router
