import { Meal } from '../models/meal.js'

function create(req, res) {
  Meal.create(req.body)
  .then(meals => {
    res.redirect('/meals/new')
    console.log('created');
  })
  .catch(err => {
    console.log(err)
    res.redirect('/meals/new')
  })
}

function newMeal(req, res) {
  Meal.find({})
  .then(meals => {
    res.render('meals/new', {
      meals: meals,
      title: 'Create Meal'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteMeal(req, res) {
  Meal.findByIdAndDelete(req.params.id)
  .then(meals => {
    res.redirect('/meals/new')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
  create,
  newMeal as new,
  deleteMeal as delete,
}