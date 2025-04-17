import mongoose from 'mongoose';
import Admin from './model/admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news-hub', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create new admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@example.com'
        });

        // Register admin with password
        await Admin.register(admin, 'admin123', (err, user) => {
            if (err) {
                console.error('Error creating admin:', err);
                process.exit(1);
            }
            console.log('Admin created successfully!');
            console.log('Username: admin');
            console.log('Email: admin@example.com');
            console.log('Password: admin123');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin(); 