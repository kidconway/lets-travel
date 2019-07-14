const { Router } = require('express')
const router = Router()

const { homePage, listAllHotels } = require('../controllers/hotelController')

// Get all day
router.get('/', homePage)
router.get('/all', listAllHotels)



module.exports = router
