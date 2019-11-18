var express = require('express');
var router = express.Router();

var UserLogin = require('../models/userLogin')

var multer = require("multer");

router.post('/createUserLoginState', function (req, res, next) {
    let date= req.body;

    var newUserLoginState = new UserLogin({
        username: date.username,
        name: date.user,
        email: date.email,
        startDate: date.startDate,
        endDate: date.endDate
    })
    UserLogin.createUserLoginState(newUserLoginState, function (err, userLoginState) {
        if (err) throw err;
        return res.json({ responce: 'sucesss' });
    })
});


module.exports = router;


