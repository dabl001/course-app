const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
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

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('65314d27e7dda2b1a1cee230');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
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
