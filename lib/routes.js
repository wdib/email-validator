/*
 * routes.js - module to provide routing
*/
/*global */

//-------------------- BEGIN MODULE SCOPE VARIABLES --------------------------
'use strict';
var
  debug     = require( 'debug'       )( 'routes' ),
  validator = require( './validator' ),
  configRoutes;
//-------------------- END MODULE SCOPE VARIABLES ----------------------------

//-------------------- BEGIN PUBLIC METHODS ----------------------------------
configRoutes = function( app ){

  // Set the content type for all requests
  app.all( '/*?', function( request, response, next ){
    response.set( 'Content-Type', 'application/json' );
    next();
  });

  // Update the document matching the ID specified and return it
  app.post( '/check', async function( request, response ){
    try {
      var
        email_str  = request.body.email,
        result_map = await validator.validate( email_str );
      response
        .status( 200 )
        .send( result_map );
    }
    catch( e ){
      debug( e );
      response
        .status( 500 )
        .send( 'Sorry, sommething went wrong. Please try again later.' );
    }
  });

};

module.exports = { configRoutes : configRoutes };
//-------------------- END PUBLIC METHODS ------------------------------------