const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var list = [];

app.use(express.static('./html.css'));

io.on('connection', socket => {
    
    list.push({id: socket.id, pseudo: ''})
    console.log('list of users :', list)
    io.emit('list', list)

    console.log('user connected :',socket.id)
    socket.on('loaded', (data) => {
        console.log('data from client :', data)
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('message',data)
    })

    socket.on('pseudo', (data) => {
        socket.broadcast.emit('pseudo',data)
    })

    socket.on('log', (data) => {
        console.log(socket.id, data)
        list[list.findIndex(element => {
            return element.id === socket.id
        })].pseudo = data
        io.emit('list', list)
    })

    //chat privée
    socket.on('join', (data) => {
        socket.join(data.pseudo); 
    })
})

app.get('/',(req, res) => {
    res.sendfile(__dirname + '/views/index.html')

})

http.listen(3000, () => {
    console.log('Server is up and running on http://localhost:3000')
})