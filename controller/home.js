const recipesController = require('./recipes');
const recipeplanController = require('./recipeplan');

module.exports.renderHome = async (req, res) => {
    const amount = 2;
    const recipes = await recipesController.getRecipes(null, amount);
    const recipeplan = await recipeplanController.getPlan();
    console.log(recipes);
    res.render('home', {recipes, recipeplan});
};

module.exports.renderContent = async (req, res) => {
    const content = await recipesController.getRecipes();
    res.render('content', {
        content: content
    });
};

module.exports.renderRecipePlan = async (req, res) => {
    const content = await recipeplanController.getPlan();

    res.render('recipeplan', {
        plans: content
    });
};

module.exports.renderStatistics = async (req, res) => {
    const content = await recipesController.getRecipes();
    res.render('statistics', {
        content: content
    });
};

module.exports.renderSettings = async (req, res) => {
    // const user = await recipesController.getRecipes();
    res.render('settings', {
        // user: user
    });
};

module.exports.generatePlan = async (req, res) => {
    // const {start, end} = req.query;
    const start = {
        date: '21',
        month: '02',
        year: '2022'
    }
    const end = {
        date: '28',
        month: '02',
        year: '2022'
    }
    const plan = await recipeplanController.generatePlan(start, end);
    res.json(plan);
    // const user = await recipesController.getRecipes();
    // res.render('settings', {
    //     user: user
    // });
};



