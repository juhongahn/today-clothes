import { Schema, model, models } from 'mongoose';

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

const Users = models?.users ?? model('users', userSchema);
export default Users;