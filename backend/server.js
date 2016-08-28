var Deepstream = require( 'deepstream.io' );
//var http = require( 'http' );
//var express = require( 'express' );
var fs = require('fs')
const {adapter} = require("spirit").node
const route = require("spirit-router")
const {file_response} = require("spirit").node
const {redirect} = require("spirit").node


const ENV = 'production';
// Create an express app
//var app = express();

// Explicitly create a http server and
// register the express app as an request listener





let errorPage = '404.html';


/*const app = route.define([

])*/

const forward = function (url) {
    var path = 'dist'+url
    return file_response('dist/index.html')
}

const stream_example = function (path) {
    return fs.createReadStream('dist/'+path)
}
const stream_example2 = function (path) {
    return file_response('dist/static/'+path)
}
/*
route.define([
    route.get("*", ["url"], forward)
])*/

const app = route.define([
    route.get("/", "Deepstream Server for City Moods project")
])

const http = require("http")

var httpServer = http.createServer(adapter(app))


// Create your deepstream server
var deepstream = new Deepstream("./backend/config/config.yml");
// Pass it the existing HTTP server

if (ENV === 'development') {
    deepstream.set('webServerEnabled', true)

    console.log( 'Deepstream HTTP server starting on 6020' );
    deepstream.start();

} else {
    deepstream.set( 'httpServer', httpServer);
// Start deepstream

    deepstream.start();

// Start the http server explicitly,
// rather than calling app.listen()
    httpServer.listen(3000)
}

