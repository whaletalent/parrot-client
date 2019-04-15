const express = require('express')
const port = process.env.PORT || 8080

const app = express()

let users = []

app.use(express.static(__dirname + "/dist/"))

app.get("/", (req, res) => {
    res.sendFile(__dirname+'/dist/index.html')
})
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/online', (req, res) =>{
    res.send(users); 
});

const server = app.listen(port, () => {
    console.log(`running at port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    let sessionid = socket.id;
    let dcid
    console.log('new socket: ', socket.id)
    //df disconnect
    socket.on('disconnect', (data) =>{
        console.log('disconnect emmited')
        dcid = users.findIndex(item => item.id == sessionid)
        if(dcid != -1){
            console.log('closed socket: ', dcid)
            users.splice(dcid, 1);
        }
        io.emit('disconnect', data)
    })
    //created socket and entered chat
    socket.on('CREATED', (data) => {
        data.id = sessionid
        users.push(data)
        io.emit('CREATED', data)
    })
    //message
    socket.on('SEND_MESSAGE', (data) => {
        io.emit('MESSAGE', data)
    })
});


