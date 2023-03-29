import mongoose from 'mongoose'

export default async function connectMongo() {
    try {
        const { connection } = await mongoose.connect(process.env.MONGODB_URI);
        if (connection.readyState === 1) {
            return Promise.resolve(true);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}