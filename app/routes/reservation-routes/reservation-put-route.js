module.exports = function (app, db) {
    
    // Update a product
    // http://localhost:4300/api/reservation
    // Sending a JSON body:
    // {
    //     "id": "12",            
    //     "start_date": "2019-09-29",
    //     "end_date": "2019-10-03",
    //     "resource_id": "30",
    //     "owner_email": "example@email.com",
    //     "comments" : "oiiejowijfoiw" 
    // }

    // or an array of products:
    // [
    //     {...},{...}
    // ]
    app.put('/api/reservation/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

         var data = req.body;
         
         if((data.constructor === Array))
            processReservations(req, res, db);
         else
            processReservation(req, res, db);
    });
};

function processReservations(req, res, db) {
    for (var reservation of req.body) {
        updateReservation(reservation, res, db);
    }
}

function processReservation(req, res, db) {
    validateRequest(req, res);
    updateReservation(req.body, res, db);
}

function checkIfReservationExists(reservation, db) {
    // check if reservation exists
    sql = "SELECT * FROM Reservations WHERE id = "+reservation.id+";";
    db.serialize(function () {
        db.all(sql, 
            function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    console.log(rows[0]);
                    if (rows !== undefined) {
                        return rows;
                    } else {
                        return undefined;
                    }
                }
            });
    });
}

function checkIfResourceExists(reservation, db) {
    sql = "SELECT * FROM Resources WHERE resource_id = "+reservation.resource_id;
    db.serialize(function () {
        db.all(sql, 
            function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    if (rows !== undefined) {
                        return rows;
                    } else {
                        return undefined;
                    }
                }
            });
    });
}

function updateReservation(reservation, res, db) {
    var id = reservation.id;
    var start_date = reservation.start_date;
    var end_date = reservation.end_date;
    var resource_id = reservation.resource_id;
    var owner_email = reservation.owner_email;
    var comments = reservation.comments;

    var sql = `UPDATE Reservations
            SET start_date = ?, end_date = ?, resource_id = ?, owner_email = ?, comments = ?
            where id = ?;`;

    var values = [start_date, end_date, resource_id, owner_email, comments, id];

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
    var schema = JSON.parse(fs.readFileSync('app/data/reservation-schema-update.json', 'utf8'));

    var JaySchema = require('jayschema');
    var js = new JaySchema();
    var instance = req.body;

    js.validate(instance, schema, function (errs) {
        if (errs) {
            console.error(errs);
            res.status(400).send(errs);
        }
    });
}