const mongoose = require('mongoose');

const partecipaSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Partecipa = mongoose.model('Partecipa', partecipaSchema);

module.exports = Partecipa;