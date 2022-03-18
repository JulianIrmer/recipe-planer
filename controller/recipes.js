const Recipe = require('../models/recipe');
const Error = require('../helpers/error');

module.exports.get = async (req, res) => {
    const recipes = await getRecipes(req.query.id);

    if (recipes.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }

    res.status(200).send({data: recipes});
};

module.exports.getRecipes = async (id) => {
    const query = id ? {_id: id} : {};
    const recipes = await Recipe.find(query).lean();
    return recipes;
}

module.exports.add = (req, res) => {
    const recipe = new Recipe(req.body);
    recipe.save();
    res.status(200).send(recipe);
};

module.exports.update = async (req, res) => {
    const {id, title, tags} = req.body;
    const recipe = await Recipe.findOne({_id: id});
    if (recipe.length === 0) {
        Error.sendError('No docs found', 404, res);
        return;
    }
    if (title) recipe.title = title;
    if (tags) recipe.tags = tags;
    recipe.save();
    res.status(200).send(recipe);
};

module.exports.delete = (req, res) => {
    Recipe.findOneAndDelete({_id: req.query.id}, () => {
        res.status(200).send('deleted');
    });
};