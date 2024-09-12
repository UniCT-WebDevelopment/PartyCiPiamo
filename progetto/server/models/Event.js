const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    location: String,
    category: String,
    images: [String],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    longitude: Number,
    latitude: Number
});

eventSchema.pre('findOneAndDelete', async function(next) {
    try {
        const eventId = this.getQuery()._id;
        await mongoose.model('Partecipa').deleteMany({ event: eventId });
        next();
    } catch (error) {
        next(error);
    }
});

eventSchema.index({ name: 'text', description: 'text'});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;