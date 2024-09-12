const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    hashedPassword: String,
    organizer: Boolean
});

userSchema.pre('findOneAndDelete', async function(next) {
    try {
        const userId = this.getQuery()._id;
        await mongoose.model('Partecipa').deleteMany({ user: userId });
        await mongoose.model('Comment').deleteMany({ user: userId });
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;