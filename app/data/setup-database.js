var fs = require('fs');
var sqlReservationSchema = fs.readFileSync('app/data/reservation-schema.sql').toString();
var sqlResourceSchema = fs.readFileSync('app/data/resource-schema.sql').toString();

module.exports = function(db) {
    db.serialize(function() {
        db.run(sqlReservationSchema);
        db.run(sqlResourceSchema);
    });
};


