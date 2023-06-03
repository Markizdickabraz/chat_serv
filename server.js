const express = require('express');
const app = express();
const cors = require('cors');

// Додайте цей код для використання пакету cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Інші налаштування CORS...
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
// const io = socketIO(server);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // Домен вашого React додатку
    methods: ['GET', 'POST'], // Дозволені HTTP методи
    credentials: true // Дозволяє передавати кредентіали (наприклад, cookies) через CORS
  }
});

// Запускаємо сервер WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');

  // Обробник події для отримання повідомлення від клієнта
    socket.on('message', (message) => {
    console.log('Received message:', message);

    // Пересилаємо повідомлення всім підключеним клієнтам
    io.emit('message', message);
  });

  // Обробник події для відключення клієнта
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});


// Запускаємо сервер на порті 4000
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
