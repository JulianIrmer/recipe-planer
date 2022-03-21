const RecipePlan = require('../models/RecipePlan');
const recipesController = require('./recipes');
const defaultConfig = {
    duration: 7
}

module.exports.generatePlan = async (startDate, endDate) => {
    const recipes = await recipesController.getRecipes();
    const data = generate(recipes, startDate, endDate);
    const recipePlan = new RecipePlan(data);
    recipePlan.save();
};

module.exports.getPlan = async () => {
    const plan = await RecipePlan.find({active: true}).lean();
    console.log(plan);
    return plan;
}

function generate(recipes, startDate, endDate) {
    const dateData = getDateDate(startDate, endDate);
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

function getDateDate(startDateObj, endDateObj) {
    const obj = {
        start: null,
        end: null,
        duration: null
    };

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const start = new Date();
    start.setDate(startDateObj.date);
    start.setMonth(startDateObj.month);
    start.setYear(startDateObj.year);

    const end = new Date();
    end.setDate(endDateObj.date);
    end.setMonth(endDateObj.month);
    end.setYear(endDateObj.year);

    obj.duration = Math.round((end.getDate() - start.getDate()) / 1000 / 60 / 60 / 24);
    obj.start = start.toLocaleDateString('de-DE', options);
    obj.end = end.toLocaleDateString('de-DE', options);

    return obj;
}