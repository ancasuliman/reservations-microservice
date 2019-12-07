module.exports = function(app, db) {
  // Load reservations by ID: http://localhost:4300/api/reservation/id/$id
  // example: http://localhost:4300/api/reservation/id/15
  app.get('/api/reservation/id/:id', (req, res) => {
    processData(res, "SELECT * FROM Reservations where id == "+req.params.id);
  });

  // Load reservations by attribute: http://localhost:4300/api/reservation/$attribute/$name
  // example: http://localhost:4300/api/reservation/start_date/2019-09-29
  //          http://localhost:4300/api/reservation/owner_email/example@email
  // $attribute = ['start_date', 'end_date', 'resource_id', 'resource_name', 'owner_email']*
  // * this is not checked values, wrong parameters will return in a DB error.
  app.get('/api/reservation/:attribute/:name', (req, res) => {
    var attribute = req.params.attribute;
    var name = attribute !== "owner_email" ? req.params.name : req.params.name + ".com";
    var queryString = "SELECT * FROM Reservations WHERE "+attribute+" = '"+name+"'";

    if (attribute === "resource_name" || attribute === "resource_id") {
      queryString = "SELECT * FROM Reservations NATURAL JOIN Resources WHERE "+attribute+" = '"+name+"'";
    }
    processData(res, queryString);
  });

  // Load all reservations: http://localhost:4300/api/reservation/
  app.get('/api/reservation', (req, res) => {
    processData(res, "SELECT * FROM Reservations");
  });

  function processData(res, sql){
    db.serialize(function() {
      db.all(sql, 
        function(err, rows) {
          if(err){
            console.error(err);
            res.status(500).send(err);
          }
          else
            sendData(res, rows, err);
      });
    });
  }

  function sendData(res, data, err){
    res.setHeader("Access-Control-Allow-Origin","*");

    if(data[0]) {
      res.send(data);
    } else{
      res.status(404).send("Reservation not found");
    }
  }
};