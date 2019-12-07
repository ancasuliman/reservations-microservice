module.exports = function (app, db) {
    // Delete a resource
    // http://localhost:4300/api/resource
    // Sending a JSON body: (only ID is mandatory)
    // {
    //     "resource_id": "12",            
    //     "resource_name": "table", 
    // }

    // or an array of reservations:
    // [
    //     {...},{...}
    // ]
    app.delete('/api/resource/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

         var data = req.body;
         
         if((data.constructor === Array))
            processResources(req, res, db);
         else
            processResource(req, res, db);
    });
};

function processResources(req, res, db){
    for (var resource of req.body) {
        updateResource(resource, res, db);
    }
}

function processResource(req, res, db){
    updateResource(req.body, res, db);
}

function updateResource(resource, res, db){
    var id = resource.resource_id;

    if(!id){
        res.status(400).send("ID is mandatory");
    }

    else{
        var sql = `DELETE FROM Resources where resource_id = ?;`;
        var values = [id];

        db.serialize(function () {
            db.run(sql, values, function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err);
                }
                else
                    res.send();
            });
        });
    }
}
