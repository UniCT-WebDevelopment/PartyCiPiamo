const User = require('../models/User')

async function organizerMiddleware(req, res, next) {

    const user =  await User.findById(req.user.id);
    if (!user) {
        return res.status(401).json({ message: 'Access denied. No user authenticated.' });
    }

    if (!user.organizer) {
        return res.status(403).json({ message: 'Access denied. User is not an organizer.' });
    }

    req.user = user;
    next()
}

module.exports = organizerMiddleware;