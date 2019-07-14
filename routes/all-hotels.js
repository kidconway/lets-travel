const { Router } = require('express')
const router = Router()


router.get('/all', (req, res, next) => {

  res.render('all-hotels', { hotel })
})

module.exports = router
