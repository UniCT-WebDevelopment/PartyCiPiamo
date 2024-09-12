require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;  // Fallback nel caso in cui la porta non sia definita
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: '*',
    methods: ["GET", "POST"]
}));

app.use(express.json());

// Connessione a MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
})();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/partecipate', require('./routes/partecipate'));
// app.use('/', require('./routes/navigate'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all route per il client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

io.on('connection', (socketClient) => {
    console.log(`Un utente si è connesso: ${socketClient.id}`);

    socketClient.on("sendComment", (comment) => {
        console.log("nuovo commento arrivato", comment._id);
        socketClient.emit("newComment", comment);
        socketClient.broadcast.emit("newComment", comment);
    });

    socketClient.on('disconnect', () => {
        console.log('Utente disconnesso');
    });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
