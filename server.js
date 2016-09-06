var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var config = require('./config/config');
var winston = require('winston');
var routeBuilder = require('./routeBuilder');

//set up logging
  var logger = new (winston.Logger)({
    level: config.logging.logLevel,
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: config.logging.logFile})
      ]
  });

  logger.info('Firing up QMC Utilities',{module:'server'});

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use('/public', express.static(config.thisServer.publicPath));
  app.use('/bower_components', express.static(config.thisServer.bowerPath));
  app.use('/data', express.static(config.thisServer.dataPath));
  app.use('/app', express.static(config.thisServer.appPath));
  app.use('/plugins', express.static(config.thisServer.pluginPath));

  logger.info(config.thisServer.appPath);

  var routes = require('./routes/routes');

  app.use('/', routes);


  var menu = [];
  routeBuilder.forEach(function(route, index)
  {
    
    app.use('/' + route.name, require(route.path));
    //build menu
    var item =
    {
      "id": index+1,
      "title": route.title,
      "templateUrl": "/" + route.name,
      "stage": route.stage
    };
    menu.push(item);
  });

  fs.writeFileSync(config.thisServer.dataPath + '/menu.json', JSON.stringify(menu));

  
  app.listen(config.thisServer.port);

