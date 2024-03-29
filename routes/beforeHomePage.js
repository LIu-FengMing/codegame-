var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')
var SendMail = require('../models/sendMail')

/* GET users listing. */
router.get('/login', function (req, res, next) {
    req.logout()
    var local = res.locals.error;
    var token = local.toString().split(' ');
    let loginURL = '/login?';
    if (token[0] == "IncorrectUsername" || token[0] == "InvalidPassword") {
        req.session.username = token[1];
        req.session.pass = token[2];
        var searchParams = new URLSearchParams({ token: token[0] });
        loginURL += searchParams.toString();
        res.redirect(loginURL);
    }
    else if(local.toString() == "userBlocked"){
        var searchParams = new URLSearchParams({ token: "userBlocked" });
        loginURL += searchParams.toString();
        res.redirect(loginURL);
    }
    else {
        var username = req.session.username, pass = req.session.pass;
        req.session.username = null
        req.session.pass = null
        res.render('beforeHome/login', { username: username, password: pass });
    }
});
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/home')
    }
);

/* GET users listing. */
router.get('/register', function (req, res, next) {
    req.logout()
    res.render('beforeHome/register', { errors: '' });
});
// Post Sign Up
router.post('/register', function (req, res, next) {
    // Parse Info
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var name = req.body.name
    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('email', 'email is required').notEmpty()
    req.checkBody('name', 'name is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('beforeHome/register', { errors: errors })
    } else {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                User.getUserByEmail(email, function (err, user) {
                    if (err) throw err;
                    if (!user) {
                        //Create User
                        var newUser = new User({
                            username: username,
                            password: password,
                            email: email,
                            name: name
                        })
                        User.createUser(newUser, function (err, user) {
                            if (err) throw err;
                        })
                        req.flash('success_msg', 'you are registered now log in')
                        // return res.redirect('/login')
                        return res.json({ responce: 'sucesss' });
                    }
                    else {
                        return res.json({ responce: 'failRepeatEmail' });
                    }
                })
            }
            else {
                return res.json({ responce: 'failRepeatName' });
            }
        })
    }
});
router.get('/forgetPass', function (req, res, next) {
    req.logout()
    res.render('beforeHome/forgetPass', { errors: '' });
})
router.post('/forgetPass', function (req, res, next) {
    // Parse Info
    var username = req.body.username
    var email = req.body.email
    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (user) {
            if (user.email != email) {
                return res.json({ responce: 'failuserisNotEmail' });
            }
            else {
                User.getUserByEmail(email, function (err, user) {
                    if (err) throw err;
                    if (user) {
                        //sendMail
                        var randPass = Math.random().toString(36) + Math.random().toString(36);//0.jh5mobu22br
                        var results = randPass.substring(3, 11);//0.jh5mobu22br
                        User.updatePassword(username, results, function (err, user) {
                            if (err) throw err;
                            if (user) {
                                User.givePassBcrypt(results, function (err, hash) {
                                    // console.log(hash);
                                    var url = req.body.homeUrl + "changePassword?token=";
                                    url += hash;
                                    var text = "你的密碼已被改為'" + results + "' 請利用這組密碼當成新密碼,並由\n";
                                    text += url + "\n去做修改密碼的工作";
                                    var mailOptions = {
                                        to: email,
                                        subject: '全速衝線-密碼確認信',
                                        text: text
                                    };
                                    var newOption = new SendMail.Options(mailOptions);
                                    // Validation
                                    SendMail.sendMail(newOption)
                                    req.session.updatePassKey = hash;
                                    // console.log(req.session.updatePassKey);

                                    return res.json({ responce: 'sucesss' });
                                });
                            }
                            else {
                                return res.json({ responce: 'fail' });
                            }
                        })
                    }
                    else {
                        return res.json({ responce: 'failEMailUndifine' });
                    }
                })
            }
        }
        else {
            return res.json({ responce: 'failNamUndifine' });
        }
    })
});

router.get('/changePassword', function (req, res, next) {
    console.log(req.query.token);
    if (req.query.token && req.session.updatePassKey == req.query.token) {
        res.render('beforeHome/changePassword');
    }
    else {
        res.redirect('/');
    }
})
router.post('/changePassword', function (req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var oldPassword = req.body.oldPassword
    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('oldPassword', 'oldPassword is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('beforeHome/register', { errors: errors })
    } else {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (user) {
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            }
            else {
                return res.json({ responce: 'failNamUndifine' });
            }
        })
    }
});


module.exports = router;


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                var script = 'IncorrectUsername ' + username + " " + password;
                return done(null, false, { message: script });
            }
            if(user.userstatus){
                if(user.userstatus==1){//被封鎖
                    var script = 'userBlocked';
                    return done(null, false, { message: script })
                } 
            }
            
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    //除了這個外都是登入失敗的檢查
                    //紀錄登入次數、這次登入時間、上次登入時間
                    var updateTime = [];
                    if(user.Logintime){
                        updateTime = user.Logintime; // 抓取過去所有的登入時間
                        var time = new Date();  // 記錄這次的登入時間
                        updateTime.push(time); // 將這次登入時間記錄進所有的登入時間
                    }else{ // 如果過去沒有登入時間跟次數，則執行以下
                        updateTime = new Date(); // 更新這次的登入時間 (F值)
                    }

                    //updateUserLogintime 更新使用者登入次數
                    User.updateUserLogintime(user.id, updateTime ,function (err, record) {
                         if (err) throw err;
                           return done(null, user)
                    })
                    
                } else {
                    var script = 'InvalidPassword ' + username + " " + password;
                    return done(null, false, { message: script })
                }
            })

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});