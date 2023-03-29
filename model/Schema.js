import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    email: String,
    password: String,
    address: { fullAddress: String, x: Number, y: Number }
});

// To use schema definition, need to convert our userSchema into a Model.
// 모델을 생성, 또는 이미 모델이 있다면 기존 모델을 사용. 
const Users = models.user || model('user', userSchema);

export default Users;