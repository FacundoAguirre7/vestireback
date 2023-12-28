const { Schema, model } = require('mongoose');

const userSchema = Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    disable: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    favorites: []
});

module.exports = model('vestire-user', userSchema);