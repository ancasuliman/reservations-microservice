module.exports = function (app, db) {
    
    // Delete a reservation
    // http://localhost:4300/api/reservation
    // Sending a JSON body: (only ID is mandatory)
    // {
    //     "id": "12",            
    //     "start_date": "2019-09-29",
    //     "end_date": "2019-10-02",
    //     "resource_id": "40",
    //     "owner_email": "example@email.com" 
    // }

    // or an array of reservations:
    // [
    //     {...},{...}
    // ]
    app.delete('/api/reservation/', (req, res) => {
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
        updateReservation(reservation, res, db);
    }
}

function processReservation(req, res, db){
    updateReservation(req.body, res, db);
}

function updateReservation(reservation, res, db){
    var id = reservation.id;

    if(!id){
        res.status(400).send("ID is mandatory");
    }

    else{
        var sql = `delete from Reservations where id = ?;`;
        var values = [id];

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
}
