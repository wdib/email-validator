/*
 * request.js - module to provide HTTP request capabilities
*/

//-------------------- BEGIN MODULE SCOPE VARIABLES --------------------------
'use strict';
var
  debug = require( 'debug' )( 'request' ),
  https = require( 'https' ),
  url   = require( 'url'   ),
  httpRequest, getRequest;
//-------------------- END MODULE SCOPE VARIABLES ----------------------------

//-------------------- BEGIN UTILITY METHODS ---------------------------------
// Begin utility method /httpRequest/
// Purpose : Send an HTTP request and return the received data
//
httpRequest = async function( method_name, url_map ){
  return new Promise( ( resolve, reject ) => {
    var
      hostname    = url_map.hostname,
      path        = url_map.path,
      request_map = {
        hostname : hostname,
        method   : method_name,
        path     : path,
        headers  : {
          'Content-Type' : 'application/json'
        }
      },
      json_list   = [],
      request, data_chunk, data_map;

    debug( `HTTP ${method_name} request sent to ${hostname}...` );

    request = https.request( request_map, response => {

      if( response.statusCode !== 200 ){
        return reject( `HTTP ${response.statusCode}` );
      }

      // Collect data chunks received
      response.on( 'data', data => {
        data_chunk = Buffer.isBuffer( data ) ? data : Buffer.from( data );
        json_list.push( data_chunk );
      });

      // When there is no more data in the response attempt to parse it
      response.on( 'end', () => {
        // Concatenate the received chunks
        json_list = Buffer.concat( json_list );
        // Parse the data
        try {
          data_map = JSON.parse( json_list );
          return resolve( data_map );
        }
        catch( e ){
          return reject( `Data could not be parsed\n${e}` );
        }
      });

    });

    // Listen for a connection error
    request.on( 'error', e => {
      return reject( `Connection error\n${e}` );
    });

    // End the request
    request.end();
  });
};
// End utility method /httpRequest/
//-------------------- END UTILITY METHODS -----------------------------------

//-------------------- BEGIN PUBLIC METHODS ----------------------------------
// Begin public method /getRequest/
// Purpose : Send an HTTP GET request and return the received data
//
getRequest = async function( get_url ){
  var get_url_map = url.parse( get_url );
  return httpRequest( 'GET', get_url_map );
};
// End public method /getRequest/

// Neatly export public methods
module.exports = {
  get : getRequest
};
//-------------------- END PUBLIC METHODS ------------------------------------

//-------------------- BEGIN MODULE INITIALISATION ---------------------------
//-------------------- END MODULE INITIALISATION -----------------------------