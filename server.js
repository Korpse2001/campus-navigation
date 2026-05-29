const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'rooms.json');

// Read Data
function readRooms() {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
}

// Write Data
function writeRooms(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Home Route
app.get('/', (req, res) => {
    res.json({
        message: 'Campus Navigation Backend Running Successfully'
    });
});

// Get All Rooms
app.get('/api/rooms', (req, res) => {
    const rooms = readRooms();
    res.json(rooms);
});

// Search Room
app.get('/api/rooms/:id', (req, res) => {
    const roomId = req.params.id.toUpperCase();
    const rooms = readRooms();

    const room = rooms.find(r =>
        r.id.toUpperCase() === roomId ||
        r.name.toUpperCase().includes(roomId)
    );

    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    res.json({
        success: true,
        data: room
    });
});


// Update Room
app.put('/api/rooms/:id', (req, res) => {
    const roomId = req.params.id.toUpperCase();
    const rooms = readRooms();

    const index = rooms.findIndex(r => r.id.toUpperCase() === roomId);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    rooms[index] = {
        ...rooms[index],
        ...req.body
    };

    writeRooms(rooms);

    res.json({
        success: true,
        message: 'Room updated successfully',
        data: rooms[index]
    });
});

// Delete Room
app.delete('/api/rooms/:id', (req, res) => {
    const roomId = req.params.id.toUpperCase();
    let rooms = readRooms();

    const roomExists = rooms.some(r => r.id.toUpperCase() === roomId);

    if (!roomExists) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
    }

    rooms = rooms.filter(r => r.id.toUpperCase() !== roomId);
    writeRooms(rooms);

    res.json({
        success: true,
        message: 'Room deleted successfully'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});