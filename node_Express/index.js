const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const homeRouts = require('./routes/home');
const addRouts = require('./routes/add');
const coursesRouts = require('./routes/courses');
const ordersRouts = require('./routes/orders');
const cardRouts = require('./routes/card');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI =
    'mongodb+srv://dabl01:Abyl2001@cluster0.4oqyp.mongodb.net/shop';
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'some secret value',
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouts);
app.use('/add', addRouts);
app.use('/courses', coursesRouts);
app.use('/orders', ordersRouts);
app.use('/card', cardRouts);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

mongoose
    .connect('mongodb+srv://dabl01:Abyl2001@cluster0.4oqyp.mongodb.net/shop')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
