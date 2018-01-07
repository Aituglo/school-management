var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config/config.js');

router.get('/', function (req, res) {
    res.render('account/login');
});


router.post('/', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('account/login', { error: 'An error occurred' });
        }

        if (!body.token) {
            return res.render('account/login', { error: body, username: req.body.username });
        }

        // save JWT token in the session to make it available to the angular app
        req.session.token = body.token;
        req.session.username = req.body.username;
        

        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

module.exports = router;