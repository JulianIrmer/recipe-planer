const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');

// ROUTE IMPORTS
const homeController = require('./routes/home');
const recipeController = require('./routes/recipes');

// CONFIG
require('dotenv').config();

// SETUP
const app = express();
const PORT = process.env.PORT || 3000;
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static(__dirname + '/views'));

// MIDDLEWARE
app.use(cors());
app.use(helmet());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('tiny', { stream: accessLogStream }));
app.use(bodyParser.json());

// MONGO CONNECTION
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error));

// ROUTES
app.use('/', homeController);
app.use('/recipes', recipeController);

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});