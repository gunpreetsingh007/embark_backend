var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8085;
var LogRoutes = require('./classes/route-logger');
const path = require("path")

// models
var models = require("./database/models");

// routes
var dashboardRoutes = require('./routes/dashboard.route');

//Authenticate Database
models.sequelize.authenticate().then(function () {
    console.log('connected to database')
    init()
}).catch(function (err) {
    console.log("Error Connecting to Database")
});

const init = async () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use('/images', express.static(path.join(__dirname, "../images")));
    app.use(LogRoutes);

    // index path
    app.get('/', function (req, res) {
        console.log('app listening on port: ' + port);
        res.send('App is running')
    });

    app.use('/dashboard',dashboardRoutes);


    app.all('*', function (req, res) {
        res.status(404).send({ 'error': 'unknown path for services.' });
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}