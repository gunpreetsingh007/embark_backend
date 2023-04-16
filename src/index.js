var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8085;
var LogRoutes = require('./classes/route-logger');
const path = require("path")
const cors = require("cors")

// models
var models = require("./database/models");

// routes
var hierarchyRoutes = require('./routes/hierarchy.route');
var productRoutes = require("./routes/product.route");
var authRoutes = require("./routes/auth.route");
var userRoutes = require("./routes/user.route");
var fileRoutes = require("./routes/files.route");
var addProductRoutes = require("./routes/addProduct.route")
var bannerRoutes = require("./routes/banner.route")

// middlewares
var { validateToken } = require('./middlewares/jwt')

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

    app.use(cors())

    app.use('/images', express.static(path.join(__dirname, "../images")));
    app.use(LogRoutes);

    // index path
    app.get('/', function (req, res) {
        console.log('app listening on port: ' + port);
        res.send('App is running')
    });

    app.use('/hierarchy', hierarchyRoutes);
    app.use('/product', productRoutes);
    app.use('/auth', authRoutes);
    app.use('/user', validateToken, userRoutes)
    app.use('/file',fileRoutes);
    app.use('/addProduct',addProductRoutes);
    app.use('/banner',bannerRoutes);


    app.all('*', function (req, res) {
        res.status(404).send({ 'error': 'unknown path for services.' });
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}