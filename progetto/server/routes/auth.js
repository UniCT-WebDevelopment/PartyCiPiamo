const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const organizerMiddleware = require('./organizerMiddleware');
const User = require('../models/User');


async function checkUser(email, username) {
    try {
        const user = await User.findOne({ username: username });
        const em = await User.findOne({ email: email });

        if (user || em) {
            console.log('Utente o email già in uso');
            return user || em;
        } else {
            console.log('Nessun utente trovato con questi dati.');
            return null;
        }
    } catch (err) {
        console.error('Errore:', err);
        return null;
    }
}


router.post('/register', async (req, res) => {
    const { email, username, password, organizer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userExists = await checkUser(email, username);
        if (!userExists) {
            const newUser = new User({ email, username, hashedPassword, organizer });
            await newUser.save();
            console.log("Nuovo utente registrato");
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } else {
            res.status(400).json({ message: 'Username o email già in uso!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { emailIn, passwordIn } = req.body;

    try {
        // Trova l'utente in base all'email
        const user = await User.findOne({ email: emailIn });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(passwordIn, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log("Utente", user._id, "loggato");

        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Token is valid', user: { _id: user._id, email: user.email, username: user.username, organizer: user.organizer } });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying token', error });
    }
});

router.get('/verifyOthers', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Token is valid', user: { _id: user._id, email: user.email, username: user.username, organizer: user.organizer } });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying token', error });
    }
});

router.get('/verifyOrganizer', authMiddleware, organizerMiddleware, async (req, res) => {
    try {
        res.status(200).json({ message: 'Token is valid', user: { _id: req.user._id, email: req.user.email, username: req.user.username, organizer: req.user.organizer } });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying token', error });
    }
});

router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("Utente", user._id, "eliminato");
        res.status(200).json({ message: 'User and participations deleted successfully', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
