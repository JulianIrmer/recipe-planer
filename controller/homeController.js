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
    const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
    const today = new Date().toLocaleDateString('de-DE', options);

    for (let i = 0; i < plan.recipes.length; i++) {
        const {displayDate} = plan.recipes[i];
        if (today === displayDate) {
            return plan.recipes[i].recipe;
        }
    }
}




