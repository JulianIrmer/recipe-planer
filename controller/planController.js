const Plan = require('../models/RecipePlan');
const recipesController = require('./recipeController');

module.exports.render = async (req, res) => {
    const plans = await getPlan();

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

module.exports.add = async (req, res) => {
    const recipes = await recipesController.get();
    const data = generate(recipes, req.body.startDate, req.body.endDate);
    if (!data) {
        res.redirect('/recipe/addplan');
        return;
    }

    const plan = new Plan(data);

    plan.save((err) => {
        if (err) {
            res.redirect('/recipe/addplan');
        } else {
            res.redirect('/plan');
        }
    });
};

async function getPlan() {
    const plan = await Plan.find().lean();
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
            obj.recipes.push(recipe);
            if (recipe.forTwoDays) {
                obj.recipes.push(recipe);
                daysLeft -= 2;
                counter += 2;
            } else {
                daysLeft -= 1;
                counter++;
            }
        }
    }

    for (let el of obj.recipes) {
        console.log(el.title);
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
        if (oldRecipe.tags.indexOf(currentRecipe.tags[i]) > -1) {
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