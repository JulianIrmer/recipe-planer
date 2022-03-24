const mongoose = require('mongoose');

const RecipePlan = new mongoose.Schema({
    start: {type: String, required: true},
    end: {type: String, required: true},
    originalStartDate: {type: String, required: true},
    duration: {type: Number, required: true},
    recipes: {type: Array, required: true},
    active: {type: Boolean, required: false},
}, {collection: 'recipePlans'});

module.exports = mongoose.model('RecipePlan', RecipePlan);