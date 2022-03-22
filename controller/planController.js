const Plan = require('../models/RecipePlan');
const recipesController = require('./recipeController');

module.exports.render = async (req, res) => {
    const plans = await getPlans();

    res.render('plan', {plans});
};

module.exports.renderAdd = async (req, res) => {
    res.render('addplan');
};

module.exports.delete = async (req, res) => {
    Plan.findOneAndDelete({_id: req.query.id}, () => {
        res.status(200).send('deleted');
    });
};

module.exports.update = async (req, res) => {
    const {planId, recipeId} = req.query;;
    let plan = await Plan.findOne({_id: planId});
    plan = checkRecipeInPlan(plan, recipeId);
    plan.markModified('recipes');
    plan.save((err, doc) => {
        console.log(doc);
        res.status(200).send({doc});

    });
};

function checkRecipeInPlan(plan, recipeId) {
    for (let i = 0; i < plan.recipes.length; i++) {
        if (plan.recipes[i].recipe._id.toString() === recipeId) {
            plan.recipes[i].recipe.isChecked = !plan.recipes[i].recipe.isChecked;
        }
    }
    return plan;
}

module.exports.add = async (req, res) => {
    const recipes = await recipesController.get();
    const data = generate(recipes, req.body.startDate, req.body.endDate);
    if (!data) {
        res.redirect('/recipes/addplan');
        return;
    }

    const plan = new Plan(data);

    plan.save((err) => {
        if (err) {
            res.redirect('/recipes/addplan');
        } else {
            res.redirect('/plan');
        }
    });
};

async function getPlans() {
    const plan = await Plan.find().lean();
    return plan;
}

async function getPlan() {
    const plan = await Plan.findOne().lean();
    return plan;
}

module.exports.getPlan = getPlan;

function generate(recipes, startDate, endDate) {
    const dateData = getDateData(startDate, endDate);
    if (!dateData) return false;
    const obj = {
        start: dateData.start,
        end: dateData.end,
        recipes: [],
        duration: dateData.duration,
        active: true
    };

    let counter = 0;
    let maxRecipeQty = obj.duration;
    let daysLeft = obj.duration

    while (counter !== maxRecipeQty) {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        const recipe = recipes[randomIndex];

        if (isRecipeValid(recipe, obj.recipes[counter - 1], daysLeft, obj.recipes)) {
            let dateOfRecipe = new Date(startDate);
            const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
            recipe.isChecked = false;
            dateOfRecipe.setDate(dateOfRecipe.getDate() + counter);
            obj.recipes.push({
                recipe, 
                originalDate: dateOfRecipe.setHours(0, 0, 0, 0),
                displayDate: dateOfRecipe.toLocaleDateString('de-DE', options)
            });

            if (recipe.forTwoDays) {
                dateOfRecipe.setDate(dateOfRecipe.getDate() + 1);
                obj.recipes.push({
                    recipe,
                    originalDate: dateOfRecipe.setHours(0, 0, 0, 0),
                    displayDate: dateOfRecipe.toLocaleDateString('de-DE', options)
                });
                daysLeft -= 2;
                counter += 2;
            } else {
                daysLeft -= 1;
                counter++;
            }
        }
    }

    return obj;
}

function isRecipeValid(currentRecipe, oldRecipe, daysLeft, recipes) {
    if (currentRecipe.forTwoDays && daysLeft <= 1) return false;
    if (!oldRecipe) return true; 

    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].title === currentRecipe.title) return false;
    }

    for (let i = 0; i < currentRecipe.tags.length; i++) {
        if (oldRecipe.recipe.tags.indexOf(currentRecipe.tags[i]) > -1) {
            return false;
        }
    }

    return true;
}

function getDateData(startDate, endDate) {
    const obj = {};
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const start = new Date(startDate);
    const end = new Date(endDate);

    obj.duration = Math.round((end.getDate() - start.getDate())) + 1;
    obj.start = start.toLocaleDateString('de-DE', options);
    obj.end = end.toLocaleDateString('de-DE', options);

    if (obj.duration < 1) return false;

    return obj;
}