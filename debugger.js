// var exec = require('child_process').exec,
//     child,
//     fs = require('fs'),
//     express = require('http');;

// fs.readFile(__dirname + '/debugger.json', 'utf8', function (err, data) {
//     if (err) {
//         console.log('ERROR ' + err);
//     } else {
//         var projects = JSON.parse(data);
//         console.dir(projects);

//         projects.forEach(function (item) {

//         });
//     }
// });

var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server),
    projects;
var exec = require('child_process').exec,
    child;

server.listen(8083);

console.log('Server running on 8083 port');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/debugger.html');
});

app.get('*', function (req, res) {
  res.sendfile(__dirname + req.url);
});

io.on('connection', function (socket){
    fs.readFile(__dirname + '/debugger.json', 'utf8', function (err, data) {
        if (err) {
            console.log('ERROR ' + err);
        } else {
            projects = JSON.parse(data).projects;

            projects.forEach(function(project, index){
                project.id = index;
            });
            socket.emit('submitProjects', { projects: projects });
        }
    });
    socket.on('start', function (data) {
        child = exec('node tests/server1.js',
        function (error, stdout, stderr) {
            if (stdout !== '') {
                console.log('---------stdout: ---------\n' + stdout);
            }
            if (stderr !== '') {
                console.log('---------stderr: ---------\n' + stderr);
            }
            if (error !== null) {
                console.log('---------exec error: ---------\n[' + error + ']');
            }
        });
        console.log(data);
    });
    socket.on('stop', function (data) {
        console.log(data);
    });
    socket.on('debug', function (data) {
        console.log(data);
    });
});

//child = exec('node server.js',
//    function (error, stdout, stderr) {
//        if (stdout !== '') {
//            console.log('---------stdout: ---------\n' + stdout);
//        }
//        if (stderr !== '') {
//            console.log('---------stderr: ---------\n' + stderr);
//        }
//        if (error !== null) {
//            console.log('---------exec error: ---------\n[' + error + ']');
//        }
//    });

//console.dir(child);