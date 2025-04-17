import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import Admin from "./model/admin.js";
import jwt from 'jsonwebtoken';

// Configure passport to use local strategy for admin
passport.use('admin-local', new LocalStrategy(
    { usernameField: 'username' },
    (username, password, done) => {
        Admin.findOne({ username: username })
            .then(admin => {
                if (!admin) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                admin.authenticate(password, (err, authenticatedAdmin) => {
                    if (err) {
                        return done(err);
                    }

                    if (!authenticatedAdmin) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    return done(null, authenticatedAdmin);
                });
            })
            .catch(err => {
                return done(err);
            });
    }
));

export const adminLogin = (req, res, next) => {
    passport.authenticate('admin-local', (err, admin, info) => {
        if (err) {
            return next(err);
        }
        if (!admin) {
            return res.status(401).json({
                message: info.message,
                authenticated: false
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Admin login successful',
            token: token,
            username: admin.username
        });
    })(req, res, next);
};

export const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Register new admin
        Admin.register(new Admin({ username, email }), password, (err, admin) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            res.status(201).json({ message: 'Admin created successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 