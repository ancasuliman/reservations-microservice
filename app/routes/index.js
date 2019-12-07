const getReservationRoutes = require('./reservation-routes/reservation-get-route');
const postReservationRoutes = require('./reservation-routes/reservation-post-route');
const putReservationRoutes = require('./reservation-routes/reservation-put-route');
const deleteReservationRoutes = require('./reservation-routes/reservation-delete-route');

const getResourceRoutes = require('./resource-routes/resource-get-route');
const postResourceRoutes = require('./resource-routes/resource-post-route');
const deleteResourceRoutes = require('./resource-routes/resource-delete-route');

const loadDatabase = require('../data/setup-database');

module.exports = function (app, db) {

  // create database in case it was not created yeat, 
  // or update in case of migrations
  loadDatabase(db);

  // start routes
  getReservationRoutes(app, db);
  postReservationRoutes(app, db);
  putReservationRoutes(app, db);
  deleteReservationRoutes(app, db);

  getResourceRoutes(app, db);
  postResourceRoutes(app, db);
  deleteResourceRoutes(app, db);
  
};
