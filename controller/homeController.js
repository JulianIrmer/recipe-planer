const recipesController = require('./recipeController');
const recipeplanController = require('./planController');

module.exports.renderHome = async (req, res) => {
    const amount = 2;
    const recipes = await recipesController.get(null, amount);
    const plan = await recipeplanController.getPlan();
    let todaysRecipe;
    if (plan) {
        todaysRecipe = getTodaysRecipe(plan);
    }

    res.render('home', {recipes, todaysRecipe, plan});
};

function getTodaysRecipe(plan) {
    const today = new Date().setHours(0, 0, 0, 0);

    for (let i = 0; i < plan.recipes.length; i++) {
        const {originalDate} = plan.recipes[i];
        if (today === originalDate) {
            return plan.recipes[i].recipe;
        }
    }
}




