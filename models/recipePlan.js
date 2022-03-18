const mongoose = require('mongoose');

const RecipePlan = new mongoose.Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    recipes: {type: Array, required: true}
}, {collection: 'recipePlans'});

module.exports = mongoose.model('RecipePlan', RecipePlan);