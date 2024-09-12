const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const organizerMiddleware = require('./organizerMiddleware');
const User = require('../models/User');
const Event = require('../models/Event');
const Comment = require('../models/Comments');
const Partecipa = require('../models/Partecipa');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Il file deve essere un .jpg'), false);
        }
    }
});

router.get('/eventsOf', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const events = await Event.find({ organizer: user._id });
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

router.get('/commentsOf', async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.headers.event }).populate('user', 'username');
        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

router.get('/futureEvents', authMiddleware, async (req, res) => {
    try {
        const now = new Date();
        const participations = await Partecipa.find({ user: req.query.userId }).populate('event');
        const futureEvents = participations.map(p => p.event).filter(event => event && new Date(event.date) > now);
        res.status(200).json(futureEvents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

router.get('/pastEvents', authMiddleware, async (req, res) => {
    try {
        const now = new Date();
        const participations = await Partecipa.find({ user: req.query.userId }).populate('event');
        // Filtra gli eventi per data passata
        const pastEvents = participations.map(p => p.event).filter(event => event && new Date(event.date) <= now);

        res.status(200).json(pastEvents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});


router.post('/create', upload.array('images'), async (req, res) => {

    try {
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        const { name, description, date, location, category, images, organizer, longitude, latitude } = req.body;

        const newEvent = new Event({
            name,
            description,
            date,
            location,
            category,
            images: imagePaths,
            organizer,
            longitude,
            latitude
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.delete('/delete', authMiddleware, organizerMiddleware, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.query.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event and participations deleted successfully', event });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/addComment', async (req, res) => {

    try {
        const { text, user, event, data } = req.body;

        const newComment = new Comment({
            text,
            user,
            event,
            data
        });
        const savedComment = (await newComment.save());
        const populatedComment = await Comment.findById(savedComment._id).populate('user');
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/category', async (req, res) => {
    try {
        const { category } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 9;

        const now = new Date();

        const query = {
            ...category && category !== 'tutto' ? { category } : {},
            date: { $gt: now }
        };

        const events = await Event.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ date: 1 });

        const totalEvents = await Event.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);

        console.log(events);

        res.json({
            events: events,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

router.get('/markers', async (req, res) => {
    try {
        const markers = await Event.find();
        const now = new Date();
        const futureEvents = markers
            .filter(event => event && new Date(event.date) > now);
        if (!markers) {
            return res.status(404).json({ message: 'Markers not found' });
        }
        res.status(200).json(futureEvents);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving markers details', error });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.search || '';
    try {
        const now = new Date();

        const events = await Event.find({
            $text: { $search: query },
            date: { $gt: now }
        });

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving events' });
    }
});


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving event details', error });
    }
});


module.exports = router;
