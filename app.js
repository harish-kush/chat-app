const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = [];

io.on('connection', function (socket) {
    let currentUser = null;

    socket.on('setUserName', function (data) {
        console.log(data + ' connected');

        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' already exists');
        } else {
            users.push(data);
            currentUser = data;
            socket.emit('userSet', { username: data });
        }
    });

    socket.on('msg', function (data) {
        io.sockets.emit('newmsg', data);
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            users.splice(users.indexOf(currentUser), 1);
            console.log(currentUser + ' disconnected');
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});
