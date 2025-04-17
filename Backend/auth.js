import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import User from "./model/user.js";

passport.use(new LocalStrategy((email, password, done) => {
    console.log(email);
    User.findOne( { email: email } )
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username or email.' });
            }

            // Use the authenticate method provided by passport-local-mongoose
            user.authenticate(password, (err, authenticatedUser) => {
                if (err) {
                    return done(err);
                }

                if (!authenticatedUser) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                // If authentication is successful, return the user
                return done(null, authenticatedUser);
            });
        })
        .catch(err => {
            return done(err);
        });
}));

 export const signup = (req, res) => {

    try {
        User.register({ username: req.body['username'], email: req.body.email }, req.body['password'], function (err, nuser) {
            if (err) {
                res.status(400).send({message: err.message});
            }
            else {
                passport.authenticate('local')(req, res, () => {
                    res.status(200).send({message: 'hello ' + req.body.username + '!',userID:nuser._id,userName:req.body.username});
                });
            }
        })
    } catch (error) {
        res.status(400).send({message: error.message});
    }

}

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(user);
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log(info.message);
            return res.status(200).json({
                message: info.message,
                authenticated: false
            });
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).json({
                message: 'User login successful',
                userId: user._id,
                username: req.body.username
            });
        });
    })(req, res, next);
};

