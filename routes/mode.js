const express = require('express')
const router = express.Router()



router.get('/quickshare', (req, res) => {
  res.render('quickshare')
})
router.get('/peer2peer', (req, res) => {
    res.render('quickshare')
  })
// define the about route

module.exports = router