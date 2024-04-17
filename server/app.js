import express from "express"
import { Server } from 'socket.io'
import { createServer } from "http"
import cors from 'cors'

const port = 5000;

const app = express();
const server = createServer(app);

const io = new Server(server, 
    {
    cors: {
        origin: ["http://192.168.1.11:3000", "http://localhost:3000", "http://192.168.1.12:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    }
}
)

app.use(cors({

    origin: ["http://192.168.1.11:3000", "http://localhost:3000", "http://192.168.1.12:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}))
app.get("/", (req, res) => {
    res.send("Hello World! Im here")
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id)

    socket.on("message", ({message, socketId}) => {
        console.log(message, socketId)
        io.emit("receive-message", { id: socketId, message: message })
    })

    socket.on("room-message", ({message, room, socketId}) => {
        console.log(message,room, socketId)
        io.to(room).emit("room-receive-message", { id: socketId, room: room, message: message })
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
    // socket.emit("message", `Welcome to the server, ${socket.id}`)
    // socket.broadcast.emit("message", `${socket.id} joined the server.`)
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})