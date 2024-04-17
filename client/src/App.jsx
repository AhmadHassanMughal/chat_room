import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, TextField, Typography, Box } from "@mui/material"
const App = () => {
  const socket = useMemo(() => io("http://192.168.1.11:5000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState()
  const [messages, setMessages] = useState([])
  const [roomMessages, setRoomMessages] = useState([])
  const [socketId, setSocketId] = useState()
  console.log(messages)

  const [groupButton, setGroupButton] = useState(false)
  const [roomButton, setRoomButton] = useState(false)

  const handleButton = (b) => {
    if (b == 'group') {
      setGroupButton(true)
      setRoomButton(false)
    } else if (b == 'room') {
      setRoomButton(true)
      setGroupButton(false)
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", { message, socketId })
    setMessage("")
  }
  const handleSubmitRoom = (e) => {
    e.preventDefault()
    socket.emit("room-message", { message, room, socketId })
    setMessage("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id)

    })
    socket.on('receive-message', ({ id, message }) => {
      setMessages((prevMessages) => [...prevMessages, { id, message }]);
    });
    socket.on('room-receive-message', ({ id, message, room }) => {
      setRoomMessages((prevMessages) => [...prevMessages, { id, message, room }]);
    });
    // socket.on("message", (s) => console.log(s))

    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <div>
      <Container maxWidth="md" >
        <Box sx={{ height: 100 }} />
        <Typography variant='h7' component="div" gutterBottom >{socketId}</Typography>
        <Button onClick={() => handleButton('group')} type='submit' variant='contained' color='primary' sx={{ marginTop: 3, height: 50 }} >For Group Chat</Button>
        <Button onClick={() => handleButton('room')} type='submit' variant='contained' color='primary' sx={{ marginTop: 3, marginLeft: 3, height: 50 }} >For Room Chat</Button>
        <Box sx={{ height: 30 }} />

        {groupButton && (
          <>
            <form action="" onSubmit={handleSubmit}>
              <TextField value={message} onChange={e => setMessage(e.target.value)} label="Outlined" variant='outlined' />
              <Button type='submit' variant='contained' color='primary' sx={{ marginLeft: 3, height: 50 }} >Send</Button>
            </form>

            {messages.map((m, i) => (
              <Typography key={i} variant='h6' component="div" gutterBottom >{`[${m.id}]: ${m.message}`}</Typography>
            ))}
          </>

        )}
        {roomButton && (
          <>
            <form action="" onSubmit={handleSubmitRoom}>
              <TextField value={message} onChange={e => setMessage(e.target.value)} label="Message" variant='outlined' />
              <TextField sx={{ marginLeft: 2, }} value={room} onChange={e => setRoom(e.target.value)} label="Friend Id" variant='outlined' />
              <Button type='submit' variant='contained' color='primary' sx={{ marginLeft: 3, height: 50 }} >Send</Button>
            </form>

            {roomMessages.map((m, i) => (
              <Typography key={i} variant='h6' component="div" gutterBottom >{`[${m.id}]: ${m.message}`}</Typography>
            ))}
          </>

        )}

      </Container>
    </div>
  )
}

export default App
