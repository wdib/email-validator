/*
 * validator.js - module to provide email validation capabilities
*/

//-------------------- BEGIN MODULE SCOPE VARIABLES --------------------------
'use strict';
var
  debug         = require( 'debug'     )( 'validator' ),
  mailCheck     = require( 'mailcheck' ),
  request       = require( './request' ),
  disposableUrl = 'https://disposable.debounce.io',
  dnsLookupUrl  = 'https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=',
  mailCheckMap  = {
    domains            : [
      'gmail.com', 'outlook.com', 'hotmail.com',
      'yahoo.com', 'aol.com',     'msn.com'
    ],
    secondLevelDomains : [
      'gmail', 'outlook', 'hotmail',
      'yahoo', 'aol',     'msn'
    ],
    topLevelDomains    : [
      'com', 'net', 'org'
    ]
  },
  checkMisspelling, validateEmail;
//-------------------- END MODULE SCOPE VARIABLES ----------------------------

//-------------------- BEGIN UTILITY METHODS ---------------------------------
// Begin utility method /checkMisspelling/
// Purpose : Check for any misspellings in the email address
//
checkMisspelling = async function( email_str ){
  return new Promise( ( resolve, reject ) => {
    var check_map = {
      domains            : mailCheckMap.domains,
      secondLevelDomains : mailCheckMap.secondLevelDomains,
      topLevelDomains    : mailCheckMap.topLevelDomains,
      email              : email_str,
      suggested          : function( suggestion ){
        return resolve( suggestion );
      },
      empty              : function(){
        return resolve();
      }
    };
    mailCheck.run( check_map );
  });
};
// End utility method /checkMisspelling/
//-------------------- END UTILITY METHODS -----------------------------------

//-------------------- BEGIN PUBLIC METHODS ----------------------------------
// Begin public method /validateEmail/
// Purpose : Validate the given email address and return the results
//
validateEmail = async function( email_str ){
  var
    disposable_url  = disposableUrl + '/?email=' + email_str,
    domain_name     = email_str.match( /@(.+)/ )[ 1 ],
    dns_lookup_url  = dnsLookupUrl  + `&domainName=${domain_name}&type=mx&outputFormat=json`,
    result_map      = await Promise.all([
      request.get( disposable_url ),
      checkMisspelling( email_str ),
      request.get( dns_lookup_url )
    ]),
    disposable_map  = result_map[ 0 ],
    misspelling_map = result_map[ 1 ],
    dns_map         = result_map[ 2 ],
    is_disposable   = disposable_map.disposable === 'true',
    has_misspelling = misspelling_map ? true : false,
    has_mx_record   = dns_map
      && dns_map.DNSData
      && dns_map.DNSData.dnsRecords
      && dns_map.DNSData.dnsRecords.length > 0,
    return_map      = {
      temp        : is_disposable,
      misspelled  : has_misspelling,
      autocorrect : has_misspelling ? misspelling_map.full : null,
      invalid     : ! has_mx_record
    };
  return return_map;
};
// End public method /validateEmail/

// Neatly export public methods
module.exports = {
  validate : validateEmail
};
//-------------------- END PUBLIC METHODS ------------------------------------

//-------------------- BEGIN MODULE INITIALISATION ---------------------------
//-------------------- END MODULE INITIALISATION -----------------------------