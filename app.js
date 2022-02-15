/*
 * app.js - Express server with routing
*/
/*global */

//-------------------- BEGIN MODULE SCOPE VARIABLES --------------------------
'use strict';
var
  http         = require( 'http'         ),
  express      = require( 'express'      ),
  bodyParser   = require( 'body-parser'  ),
  logger       = require( 'morgan'       ),
  errorHandler = require( 'errorhandler' ),
  debug        = require( 'debug'        )( 'app' ),
  routes       = require( './lib/routes' ),
  app          = express(),
  server       = http.createServer( app ),
  env          = app.get( 'env' ),
  port         = 3000;
//-------------------- END MODULE SCOPE VARIABLES ----------------------------

//-------------------- BEGIN SERVER CONFIGURATION ----------------------------
// Log HTTP requests and errors
app.use( logger( 'dev' ) );
app.use( errorHandler()  );

// Mount middleware at the root of the application
app.use( bodyParser.json() );

// Configure routes
routes.configRoutes( app, server );
//-------------------- END SERVER CONFIGURATION ------------------------------

//-------------------- BEGIN START SERVER ------------------------------------
server.listen( port, function(){
  debug(
    'Express server listening on port %d in %s mode',
    server.address().port, env
  );
});
//-------------------- END START SERVER --------------------------------------