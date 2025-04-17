import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model('admin', adminSchema);

export default Admin; 