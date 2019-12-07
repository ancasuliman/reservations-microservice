module.exports = function (app, db) {
    
    // Add new reservation
    // http://localhost:4300/api/reservation
    // Sending a JSON body:
    // {
    //     "start_date": "2019-09-29",
    //     "end_date": "2019-10-03",
    //     "resource_id": "1",
    //     "owner_email": "example@email.com",
    //     "comments": "Comment example"  
    // }

    // or an array of reservations:
    // [
    //     {...},{...}
    // ]
    app.post('/api/reservation/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

         var data = req.body;
         
         if((data.constructor === Array))
            processReservations(req, res, db);
         else
            processReservation(req, res, db);
    });
};

function processReservations(req, res, db){
    for (var reservation of req.body) {
        insertReservation(reservation, res, db);
    }
}

function processReservation(req, res, db){
    validateRequest(req, res);
    insertReservation(req.body, res, db);
}

function insertReservation(reservation, res, db){
    var start_date = reservation.start_date;
    var end_date = reservation.end_date;
    var resource_id = reservation.resource_id;
    var owner_email = reservation.owner_email;
    var comments = reservation.comments;

    var sql = `INSERT INTO Reservations (start_date, end_date, resource_id, owner_email, comments) 
            VALUES 
            (?, ?, ?, ?, ?);`;

    var values = [start_date, end_date, resource_id, owner_email, comments];

    db.serialize(function () {
        db.run(sql, values, function (err) {
            if (err){
                console.error(err);
                res.status(500).send(err);
            }
                
            else
                res.send();
        });
    });
}

function validateRequest(req, res) {
    var fs = require('fs');
    var schema = JSON.parse(fs.readFileSync('app/data/reservation-schema.json', 'utf8'));

    var JaySchema = require('jayschema');
    var js = new JaySchema();
    var instance = req.body;

    js.validate(instance, schema, function (errs) {
        if (errs) {
            console.error(errs);
            res.status(400).send(errs);
        }
    });

    if (req.body.id) {
        res.status(400).send("ID cannot be submmited");
    }
}