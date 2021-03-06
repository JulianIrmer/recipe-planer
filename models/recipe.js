const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    tags: {type: Array, required: true, unique: false},
    ingredients: {type: Array, required: true, unique: false},
    image: {type: String, required: false},
    forTwoDays: {type: Boolean, required: false, unique: false},
    price: {type: Number, required: true, unique: false},
    timesMade: {type: Number, required: true, unique: false},
}, {collection: 'recipes'});

module.exports = mongoose.model('Recipe', RecipeSchema);