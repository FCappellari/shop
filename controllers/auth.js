const { createConnection } = require('mysql2');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.user
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('6175eb7c2b657839270aea8a')
        .then(user => {
            req.session.user = user;
            req.session.save(err => {
                if (err) 
                    console.log(err);
                    
                res.redirect('/');
            });
            
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};