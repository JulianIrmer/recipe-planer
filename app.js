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
const recipeRoutes = require('./routes/recipeRoutes');
const planRoutes = require('./routes/planRoutes');
const homeRoutes = require('./routes/homeRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

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
app.use(bodyParser.urlencoded({ extended: false }))

// MONGO CONNECTION
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error));

// ROUTES
app.use('/recipes', recipeRoutes);
app.use('/plan', planRoutes);
app.use('/home', homeRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/settings', settingsRoutes);

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});