exports.homePage = (req, res) => {

  res.render('index', { title: 'Lets travel' })
}

exports.listAllHotels = (req, res) => {

  res.render('all-hotels', { Title: 'All Hotels' })
}
