import { Flight } from '../models/flight.js'
import { Meal } from '../models/meal.js'

function index(req, res) {
  Flight.find({})
  .then(flights => {
    // flights.departs = flights.departs.toISOString().slice(0, 16)
    res.render('flights/index', {
      flights: flights,
      title: 'All Flights'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function newFlight(req, res) {
  let defDate = new Date().getFullYear()
  res.render('flights/new', {
    title: 'New Flight',
  })
}

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  Flight.create(req.body)
  .then(flights => {
    res.redirect('/flights')
    console.log(flights.departs);
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteFlight(req, res) {
  Flight.findByIdAndDelete(req.params.id)
  .then(flights => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Flight.findById(req.params.id)
  .populate('meals')
  .then(flight => {
    Meal.find({_id: {$nin: flight.meals}})
    .then(meals => {  
      res.render('flights/show', {
      title: 'Flight Details',
      flight: flight,
      meals: meals
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function edit(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    res.render('flights/edit', {
      title: 'Edit Details',
      flight: flight
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function update(req, res) {
  for (let key in req.body) {
    if(req.body[key] === "") delete req.body[key]
  }
  Flight.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(flight => {
    res.redirect(`/flights/${flight.id}`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function createTicket(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.tickets.push(req.body)
    flight.save()
    .then(() => {
      console.log(flight);
      res.redirect(`/flights/${flight.id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteTicket(req, res) {
  Flight.findById(req.params.flightId)
  .then(flight => {
    let id = req.params.ticketId
    flight.tickets.id(id).remove()
    flight.save()
    .then(ticket => {
      console.log(flight.tickets);
      res.redirect(`/flights/${flight.id}`)
    })
    .catch(err => {
      console.log('ERROR', err)
      res.redirect(`/flights/${flight.id}`)
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect(`/flights/${flight.id}`)
  })
}

function addMeal(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.meals.push(req.body.meal)
    flight.save()
    .then(() => {
      console.log(flight.meals);
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

function removeMeal(req, res) {
  Flight.findById(req.params.flightId)
  .populate('meals')
  .then(flight => {
    let targetId = req.params.mealId
    console.log(flight.meals)
    flight.meals = [...flight.meals].filter(({id}) => id !== targetId);
    console.log(flight.meals);
    flight.save()
    .then(meal => {
      res.redirect(`/flights/${flight.id}`)
      console.log('removed meal', flight);
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
  newFlight as new,
  create,
  index,
  deleteFlight as delete,
  show,
  edit,
  update,
  createTicket,
  deleteTicket,
  addMeal,
  removeMeal,
}