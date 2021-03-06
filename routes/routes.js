var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var winston = require('winston');
var config = require('../config/config');
var fs = require('fs');


//set up logging
var logger = new (winston.Logger)({
	level: config.logging.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config.logging.logFile})
    ]
});

router.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

router.route('/')
    .get(function(request, response)
    {
        var options = {
            root: config.thisServer.appPath
        };
        response.sendFile('main.html', options, function(err)
        {
            if(err)
            {
                logger.error("ERROR:" + err, {module:'routes.js'});
                response.status(err.status).end();
            }
        })
    });

router.route("/version")
.get(function(request, response)
{
    response.send(config.version);
});

module.exports = router;


