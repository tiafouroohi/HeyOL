require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require("jsonwebtoken");
const userControllers = require("./server/controllers/user.controllers");
const myFirstSecret = process.env.FIRST_SECRET_KEY;

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

require('./server/config/mongoose.config');
require('./server/routes/user.routes')(app);


const server = app.listen(8000, () => console.log("Now listening on port 8000"));

const io = require('socket.io')(server);
const timeout = undefined;

io.on('connection', socket => {

    socket.emit('connected');

    socket.on('joinroom', roomName => {
        console.log(roomName);
        socket.join(roomName);
    });

    socket.on('typing', data => {
            console.log(data);
            const message = ` (≧◡≦) ${data.username} is typing ... ◕‿◕ ` 
            socket.to(data.room).emit('typing', message);       
    });

    socket.on('message', data => {
        console.log(data);
        socket.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has discconected`);
    });
});

