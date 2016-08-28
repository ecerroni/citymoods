var Deepstream = require( 'deepstream.io' );
var http = require( 'http' );
var express = require( 'express' );
var fs = require('fs')


const ENV = 'production'
// Create an express app
var app = express();

// Explicitly create a http server and
// register the express app as an request listener
var server = http.createServer( app );


let rootDir =

    app.get( '/', function ( req, res ) {
        res.send(  "Deepstream Server for City Moods project" )
        //res.sendFile('frontend/index.html', {'root': './'});
        //res.sendFile('vue/'+ req.params[0], {'root': './'});
    });

let errorPage = '404.html'


// Create your deepstream server
var configPath = ENV === 'development' ? "./backend/config/config.yml" : "./config/config.yml"
var deepstream = new Deepstream(configPath);
// Pass it the existing HTTP server

if (ENV === 'development') {
    deepstream.set('webServerEnabled', true)

    console.log( 'Deepstream HTTP server starting on 6020' );
    deepstream.start();

} else {
    deepstream.set( 'httpServer', server );
// Start deepstream

    deepstream.start();

// Start the http server explicitly,
// rather than calling app.listen()
    server.listen( 6020, '0.0.0.0', function(){
        console.log( 'Express HTTP server listening on 6020' );
    });
}

