import mongoose, { Schema, model, models } from 'mongoose';

// user 스키마
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        fullAddress: String,
        x: Number,
        y: Number
    }
});

// To use schema definition, need to convert our userSchema into a Model.
const Users = models.users || model('users', userSchema);
export default Users;