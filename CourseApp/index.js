const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRouts = require('./routes/home');
const addRouts = require('./routes/add');
const coursesRouts = require('./routes/courses');
const ordersRouts = require('./routes/orders');
const cardRouts = require('./routes/card');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const keys = require('./keys');

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: keys.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(csrf());
app.use(flash());
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
    .connect(keys.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
