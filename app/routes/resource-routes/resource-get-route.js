module.exports = function(app, db) {
    // Load resources by ID: http://localhost:4300/api/resource/resource_id/$id
    // example: http://localhost:4300/api/resource/resource_id/15

    app.get('/api/resource/id/:id', (req, res) => {
        processData(res, "SELECT * FROM Resources WHERE resource_id = "+req.params.id);
    });

    // Load resources by name: http://localhost:4300/api/resource/resource_name/$name
    // example: http://localhost:4300/api/resource/resource_name/table

    app.get('/api/resource/resource_name/:name', (req, res) => {
        var name = req.params.name;
        processData(res, "SELECT * FROM Resources WHERE resource_name = "+req.params.name);
    });

    // Load all resources: http://localhost:4300/api/resource
    app.get('/api/resource', (req, res) => {
        processData(res, "SELECT * FROM Resources");
    });

    function processData(res, sql) {
        db.serialize(function () {
            db.all(sql, 
                function(err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        sendData(res, rows, err);
                    }
                });
        });
    }

    function sendData(res, data, err) {
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (data[0]) {
            res.send(data);
        } else {
            res.status(404).send("Resource not found");
        }
    }
};