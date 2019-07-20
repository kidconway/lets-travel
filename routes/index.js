const { Router } = require('express')
const router = Router()

const { homePage, listAllHotels, adminPage, createHotelGet, createHotelPost } = require('../controllers/hotelController')

// Get all day
router.get('/', homePage)
router.get('/all', listAllHotels)





// Admin Routes
router.get('/admin', adminPage)
router.get('/admin/add', createHotelGet)
router.post('/admin/add', createHotelPost)

module.exports = router
