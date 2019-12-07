module.exports = function (app, db) {
    // Add new resource
    // http://localhost:4300/api/resource
    // Sending a JSON body:
    // {
    //     "resource_name": "ExampleResourceName",
    // }

    // or an array of resources:
    // [
    //     {...},{...}
    // ]
    app.post('/api/resource/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

        var data = req.body;

        if ((data.constructor === Array)) {
            processResources(req, res, db);
        } else {
            processResource(req, res, db);
        }
    });

    function processResources(req, res, db) {
        for (var resource of req.body) {
            processResource(resource, res, db);
        }
    }

    function processResource(req, res, db) {
        validateRequest(req, res);
        insertResource(req.body, res, db);
    }

    function insertResource(resource, res, db) {
        var resource_name = resource.resource_name;

        var sql = `INSERT INTO Resources (resource_name) VALUES (?);`;
        var values = [resource_name];

        db.serialize(function() {
            db.run(sql, values, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.send();
                }
            });
        });
    }

    function validateRequest(req, res) {
        var fs = require('fs');
        var schema = JSON.parse(fs.readFileSync('app/data/resource-schema.json', 'utf8'));

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
};