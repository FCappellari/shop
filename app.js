const path = require('path');
const dotenv = require('dotenv');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

dotenv.config();

const app = express();
const store = new mongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false, 
        saveUninitialized: false, 
        store: store
    })
);

app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Teste',
                        email: 'teste@email.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save();
                }
            })

        app.listen(process.env.PORT);
    })
    .catch(err => console.log(err));