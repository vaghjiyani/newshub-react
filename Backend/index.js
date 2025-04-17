import express from 'express'
import passport from 'passport';
import User from './model/user.js';
import Admin from './model/admin.js';
import 'dotenv/config';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import * as auth from './auth.js'
import * as adminAuth from './adminAuth.js'
import jwt from 'jsonwebtoken';

const ObjectId = mongoose.Types.ObjectId;

const app = express();
app.use(cors());
const port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "do not have any screte",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/NewsHub');

// Create default admin if none exists
const createDefaultAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const admin = new Admin({ username: 'admin', email: 'admin@example.com' });
            await Admin.register(admin, 'admin123');
            console.log('Default admin account created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

// Call the function after database connection
mongoose.connection.on('connected', () => {
    createDefaultAdmin();
});

passport.serializeUser((user, done) => {
    done(null, { id: user._id, type: user instanceof Admin ? 'admin' : 'user' });
});

passport.deserializeUser((obj, done) => {
    const Model = obj.type === 'admin' ? Admin : User;
    Model.findById(obj.id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

// User routes
app.post('/login', auth.login);
app.post('/signup', auth.signup);

// Admin routes
app.post('/admin/login', adminAuth.adminLogin);
app.post('/admin/create', adminAuth.createAdmin);

// Protected admin routes
app.get('/admin/users', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        User.find({}, { username: 1, email: 1, _id: 1, phone: 1 })
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                res.status(500).json({ message: 'Error fetching users' });
            });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

// Add new user endpoint
app.post('/admin/users', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Create new user
        User.register(
            { 
                username: req.body.username, 
                email: req.body.email,
                phone: req.body.phone 
            }, 
            req.body.password,
            (err, user) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                res.status(201).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone
                });
            }
        );
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

// Delete user endpoint
app.delete('/admin/users/:userId', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        User.findByIdAndDelete(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json({ message: 'User deleted successfully' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error deleting user' });
            });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

// Admin profile endpoints
app.get('/admin/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received token:', token); // Debug log
    
    if (!token) {
        console.log('No token provided'); // Debug log
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded); // Debug log
        
        Admin.findById(decoded.id)
            .then(admin => {
                if (!admin) {
                    console.log('Admin not found for ID:', decoded.id); // Debug log
                    return res.status(404).json({ message: 'Admin not found' });
                }
                console.log('Found admin:', admin); // Debug log
                res.status(200).json({
                    username: admin.username,
                    email: admin.email
                });
            })
            .catch(err => {
                console.error('Error finding admin:', err); // Debug log
                res.status(500).json({ message: 'Error fetching admin profile' });
            });
    } catch (err) {
        console.error('Token verification error:', err); // Debug log
        return res.status(401).json({ message: 'Invalid token' });
    }
});

app.put('/admin/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        Admin.findById(decoded.id)
            .then(admin => {
                if (!admin) {
                    return res.status(404).json({ message: 'Admin not found' });
                }

                // Verify current password
                admin.authenticate(req.body.password, (err, authenticated) => {
                    if (err || !authenticated) {
                        return res.status(401).json({ message: 'Current password is incorrect' });
                    }

                    // Update username and email
                    admin.username = req.body.username;
                    admin.email = req.body.email;

                    // Update password if new password is provided
                    if (req.body.newPassword) {
                        admin.setPassword(req.body.newPassword, (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error updating password' });
                            }
                            admin.save()
                                .then(() => res.status(200).json({ message: 'Profile updated successfully' }))
                                .catch(err => res.status(500).json({ message: 'Error updating profile' }));
                        });
                    } else {
                        admin.save()
                            .then(() => res.status(200).json({ message: 'Profile updated successfully' }))
                            .catch(err => res.status(500).json({ message: 'Error updating profile' }));
                    }
                });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error updating profile' });
            });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

// Update user endpoint
app.put('/admin/users/:userId', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        User.findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Update user fields
                user.username = req.body.username;
                user.email = req.body.email;
                user.phone = req.body.phone;
                user.status = req.body.status;

                user.save()
                    .then(() => {
                        res.status(200).json({
                            message: 'User updated successfully',
                            user: {
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                status: user.status
                            }
                        });
                    })
                    .catch(err => {
                        if (err.code === 11000) {
                            res.status(400).json({ message: 'Username or email already exists' });
                        } else {
                            res.status(500).json({ message: 'Error updating user' });
                        }
                    });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error finding user' });
            });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(port, () => {
    console.log('listening at port: ' + port);
});