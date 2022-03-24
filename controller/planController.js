const Plan = require('../models/recipePlan');
const recipesController = require('./recipeController');
const hb = require('express-handlebars').create();

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

};

module.exports.add = async (req, res) => {
    try {
        const data = await generate(null, null, req.body.startDate, req.body.endDate);
    
        if (!data) {
            res.redirect('/plan/add');
            return;
        }
    
        const plan = new Plan(data.plan);
    
        plan.save((err) => {
            if (err) {
                res.redirect('/plan/add');
            } else {
                res.redirect('/plan');
            }
        });
    } catch (error) {
        console.error(error);
    }
};

async function getPlans() {
    try {
        const plan = await Plan.find().lean();
        return plan;
    } catch (error) {
        console.error(error);
    }
}

async function getPlan() {
    try {
        const plan = await Plan.findOne().lean();
        return plan;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getPlan = getPlan;

module.exports.getNewRecipe = async (req, res) => {
    try {
        const {planId, recipeId} = req.query;
        let plan = await Plan.findOne({_id: planId});
        const recipe = await recipesController.get(recipeId);
    
        for (let i = 0; i < plan.recipes.length; i++) {
            if (plan.recipes[i].recipe._id.toString() === recipe[0]._id.toString()) {
                plan.recipes[i] = {recipe: null, originalDate: null, displayDate: null};
            }
        }
        const newPlan = await generate(plan, recipe[0]._id);
        const {newRecipeIds} = newPlan;
        plan = newPlan.plan;

        plan.save(async () => {
            const html = [];
            const ids = [];
            for (let newRecipeId of newRecipeIds) {
                const recipe = plan.recipes[newRecipeId];
                html.push(await renderPlanListElement(planId, recipe));
                ids.push(recipe.recipe._id.toString());
            }
            res.status(200).send({html, ids});
        });
    } catch (error) {
        console.error(error);
    }
};

async function generate(plan, oldRecipeId, startDate, endDate) {
    try {
        const obj = plan ? plan : {};

        if (!obj.start && !obj.end && !obj.duration && !obj.recipes) {
            const dateData = getDateData(startDate, endDate);
            if (!dateData) return dateData;
            obj.originalStartDate = startDate;
            obj.start = dateData.start;
            obj.end = dateData.end;
            obj.duration = dateData.duration;
            obj.recipes = [];
            for (let i = 0; i < obj.duration; i++) {
                obj.recipes.push({recipe: null, originalDate: null, displayDate: null});
            }
        }

        const newData = await chooseRecipes(obj, oldRecipeId)
        obj.recipes = newData.recipes;


        return {plan: obj, newRecipeIds: newData.newRecipes};
    } catch (error) {
        console.error(error);
    }
}

async function chooseRecipes(obj, oldRecipeId) {    
    try {
        const recipes = await recipesController.get();
        const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
        let daysLeft = obj.recipes.filter(val => {return val.recipe === null}).length;
        const newRecipesIndex = [];

        for (let i = 0; i < obj.recipes.length; i++) {
            const currRecipe = obj.recipes[i].recipe;
            if (currRecipe) continue;
            let maxRetrys = 100;

            while (obj.recipes[i].recipe === null && maxRetrys > 0) {
                const randomIndex = Math.floor(Math.random() * recipes.length);
                const recipe = recipes[randomIndex];
                if (isRecipeValid(recipe, obj.recipes, daysLeft, i, oldRecipeId)) {
                    const dateOfRecipe = new Date(obj.originalStartDate);
                    dateOfRecipe.setDate(dateOfRecipe.getDate() + i);
                    obj.recipes[i].recipe = recipe;
                    newRecipesIndex.push(i);
                    if (!obj.recipes[i].originalDate) {
                        obj.recipes[i].originalDate = dateOfRecipe.setHours(0, 0, 0, 0);
                        obj.recipes[i].displayDate = dateOfRecipe.toLocaleDateString('de-DE', options);
                    }
                    
                    if (recipe.forTwoDays) {
                        if (obj.recipes[i + 1]) {
                            newRecipesIndex.push(i);
                            obj.recipes[i + 1].recipe = recipe;
                            if (!obj.recipes[i + 1].originalDate) {
                                dateOfRecipe.setDate(dateOfRecipe.getDate() + 1);
                                obj.recipes[i + 1].originalDate = dateOfRecipe.setHours(0, 0, 0, 0);
                                obj.recipes[i + 1].displayDate = dateOfRecipe.toLocaleDateString('de-DE', options);
                            }
                            daysLeft -= 2;
                        }
                    } else {
                        daysLeft--;
                    }
                }
                maxRetrys--;
            }
        }

        return {recipes: obj.recipes, newRecipes: newRecipesIndex};
    } catch (error) {
        console.error(error);
    }
}

function isRecipeValid(currentRecipe, recipes, daysLeft, index, oldRecipeId) {
    if (oldRecipeId) {
        if (currentRecipe._id.toString() === oldRecipeId.toString()) return false;
    }
    if (currentRecipe.forTwoDays && daysLeft <= 1) return false;
    if (!recipes[0].recipe) return true;

    for (let i = 0; i < recipes.length; i++) {
        if (!recipes[i].recipe) continue;

        if (recipes[i].recipe.title === currentRecipe.title) {
            return false;
        }
    }

    const beforeRecipe = recipes[index - 1];
    const nextRecipe = recipes[index + 1];

    for (let i = 0; i < currentRecipe.tags.length; i++) {
        if (beforeRecipe.recipe && beforeRecipe.recipe.tags.indexOf(currentRecipe.tags[i]) > -1) {
            return false;
        }
    }
    
    if (nextRecipe) {
        for (let i = 0; i < currentRecipe.tags.length; i++) {
            if (nextRecipe.recipe && nextRecipe.recipe.tags.indexOf(currentRecipe.tags[i]) > -1) {
                return false;
            }
        }
    }

    return true;
}

function getDateData(startDate, endDate) {
    const obj = {};
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const start = new Date(startDate);
    const end = new Date(endDate);

    let duration = end.getTime() - start.getTime();
    duration = (duration / 1000 / 60 / 60 / 24) + 1;
    obj.duration = duration;
    obj.start = start.toLocaleDateString('de-DE', options);
    obj.end = end.toLocaleDateString('de-DE', options);

    if (obj.duration < 1) return false;

    return obj;
}

async function renderPlanTile(plan) {
    return await hb.render('./views/partials/plantile.handlebars', {plan});
};

async function renderPlanListElement(planid, recipe) {
    return await hb.render('./views/partials/recipeli.handlebars', {planid, recipe});
};