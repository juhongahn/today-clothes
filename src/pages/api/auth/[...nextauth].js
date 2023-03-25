import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from '../../../../public/mongoClient.js';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GitHub_ID,
            clientSecret: process.env.GitHub_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
})

