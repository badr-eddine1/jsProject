// backend/routes/rooms.js

const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// Récupérer toutes les chambres
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(400).send('Error fetching rooms');
  }
});

// Ajouter une nouvelle chambre
router.post('/', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(400).send('Error adding room');
  }
});

module.exports = router;
