const express = require('express');

const fs = require('fs');

const uuid = require('uuid');

const router = express.Router();

const resData = require('../utils/restaurant-data');

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

router.get('/recommend', (req, res) => {
  res.render('recommend');
});

router.post('/recommend', (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  const restaurants = resData.getStoredRestaurants();

  restaurants.push(restaurant);

  resData.storeRestaurants(restaurants);

  res.redirect('/confirm');
});

router.get('/restaurants', (req, res) => {
  let order = req.query.order;
  let nextOrder = 'desc';

  if (order !== 'asc' && order !== 'desc') {
    order = 'asc';
  }

  if (order === 'desc') {
    nextOrder = 'asc';
  }

  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === 'asc' && resA.name > resB.name) ||
      (order === 'desc' && resA.name < resB.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
});

router.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render('restaurant-detail', { restaurant: restaurant });
    }
  }

  res.status(404).render('404');
});

module.exports = router;
