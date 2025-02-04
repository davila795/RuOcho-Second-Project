const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const Event = require('../models/event.model')


router.put('/add-event/:id', (req, res, next) => {
    User
        .findByIdAndUpdate(req.user.id, { $push: { events_id: req.params.id } })
        .then(event => res.json(event))
        .catch(err => next(new Error(err)))
})

router.delete('/remove-fav/:id', (req, res, next) => {
    User
        .findByIdAndUpdate(req.user.id, { $pull: { events_id: req.params.id } })
        .then(event => res.json(event))
        .catch(err => next(new Error(err)))
})


router.get('/:id', (req, res, next) => {
    Event
        .findById(req.params.id, { name: 1, 'images.url': 1, 'dates.start.localDate': 1, 'dates.start.localTime': 1, '_embedded.venues.name': 1, '_embedded.venues.city.name': 1, url: 1, info: 1, '_embedded.venues.location': 1, priceRanges: 1 })
        .then(event => res.json(event))
        .catch(err => next(new Error(err)))
})

router.get('/', (req, res, next) => {

    const { name, city, genre } = req.query
    req.query.priceMin ? priceMin = req.query.priceMin : priceMin = 0
    req.query.priceMax ? priceMax = req.query.priceMax : priceMax = Number.POSITIVE_INFINITY

    const regex = { name: new RegExp(name, 'i'), city: new RegExp(city, 'i'), genre: new RegExp(genre, 'i') }

    Event
        .find(
            { name: regex.name, "classifications.genre.name": regex.genre, "_embedded.venues.city.name": regex.city, "priceRanges.max": { $lte: priceMax }, "priceRanges.min": { $gte: priceMin } },
            { name: 1, 'images.url': 1, 'dates.start.localDate': 1, 'dates.start.localTime': 1, '_embedded.venues.name': 1, '_embedded.venues.city.name': 1 }
        )
        .then(event => res.json(event))
        .catch(err => next(new Error(err)))
})

module.exports = router