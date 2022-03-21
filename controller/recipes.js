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

module.exports.get = async (req, res) => {
    const recipes = await getRecipes(req.query.id);

    if (recipes.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }

    res.status(200).send({data: recipes});
};

module.exports.getRecipes = async (id, amount) => {
    const query = id ? {_id: id} : {};
    let recipes = await (await Recipe.find(query).lean()).reverse();
    if (amount) {
        recipes.length = amount;
    }
    return recipes;
}

module.exports.add = (req, res) => {
    const recipe = new Recipe(req.body);
    recipe.save((err, doc) => {
        if (err) {
            console.log(err.message);
            res.status(200).send({success: false, error: err.message});
        } else {
            res.status(203).send({success: true, data: doc});
        }
    });
};

module.exports.update = async (req, res) => {
    const {id, title, tags, ingredients} = req.body;
    const recipe = await Recipe.findOne({_id: id});

    if (recipe.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }

    if (title) recipe.title = title;
    if (tags) recipe.tags = tags;
    if (ingredients) recipe.ingredients = ingredients;

    recipe.save((err, doc) => {
        if (err) {
            console.log(err.message);
            res.status(200).send({success: false, error: err.message});
        } else {
            res.status(203).send({success: true, data: doc});
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