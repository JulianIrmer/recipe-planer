const Recipe = require('../models/recipe');
const Error = require('../helpers/error');
const hb = require('express-handlebars').create({
    helpers: {
        ifCond: (v1, v2, options) => {
            if(v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
    }}
});

module.exports.render = async (req, res) => {
    const recipes = await get();

    if (recipes.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }

    res.status(200).render('recipes', {recipes});
};

module.exports.renderAdd = async (req, res) => {
    res.render('addrecipe');
};

module.exports.renderUpdate = async (req, res) => {
    const {id} = req.query;
    const recipe = await Recipe.findOne({_id: id}).lean();
    res.render('updaterecipe', {recipe});
};

module.exports.renderRecipe = async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findOne({_id: id}).lean();
    res.render('recipe', {recipe});
};

async function get(id, amount) {
    const query = id ? {_id: id} : {};
    let recipes = (await Recipe.find(query).lean()).reverse();
    if (amount) {
        recipes.length = amount;
    }
    return recipes;
}
module.exports.get = get;

module.exports.add = (req, res) => {
    const data = getformattedData(req.body);
    const recipe = new Recipe(data);

    recipe.save((err) => {
        if (err) {
            res.render('addrecipe', {error: err.message});
        } else {
            res.redirect('/recipes');
        }
    });
};

function getformattedData(data) {
    const ingredients = data.ingredients.split(',');
    data.ingredients = ingredients;
    const tags = data.tags.split(',');
    data.tags = tags;
    data.timesMade = 0;

    if (data.for2days) {
        data.for2days = true;
    } else {
        data.for2days = false;
    }

    return data;
}

module.exports.update = async (req, res) => {
    const {id, title, tags, ingredients, price} = req.body;
    const recipe = await Recipe.findOne({_id: id});

    if (recipe.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }

    if (title) recipe.title = title;
    if (tags) recipe.tags = tags;
    if (ingredients) recipe.ingredients = ingredients;
    if (price) recipe.price = price;

    recipe.save(async (err) => {
        if (err) {
            console.log(err.message);
            res.render('updaterecipe', {error: err.message});
        } else {
            const recipes = await get();
            res.redirect('/', {recipes});
        }
    });
};

module.exports.delete = (req, res) => {
    Recipe.findOneAndDelete({_id: req.query.id}, () => {
        res.status(200).send('deleted');
    });
};

module.exports.renderUpdateForm = async (req, res) => {
    const {id} = req.query;
    const recipe = await Recipe.findOne({_id: id}).lean();
    const html = await hb.render('./views/partials/updaterecipeformular.handlebars', {recipe});
    res.send({html});
};

module.exports.renderRecipeTile = async (req, res) => {
    const {id} = req.query;
    const recipe = await Recipe.findOne({_id: id}).lean();
    const html = await hb.render('./views/partials/recipetile.handlebars', {recipe});
    res.send({html});
};