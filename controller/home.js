const recipeController = require('./recipes');

module.exports.renderHome = (req, res) => {
    res.render('home', {
        name: 'Julian'
    });
};

module.exports.renderContent = async (req, res) => {
    const content = await recipeController.getRecipes();
    res.render('content', {
        content: content
    });
};



