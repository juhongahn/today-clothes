import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../../database/conn";
import Users from "../../../../model/Schema";
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",

            /** signin() 함수가 호출되면 authorize 메서드가 호출된다. */
            async authorize(credentials, req) {
                connectMongo().catch(error => { error: "Connection Failed" });
                // 유저 체크
                const result = await Users.findOne({ email: credentials.email })
                if (!result) {
                    throw new Error("No user Found with Email Please Sign Up");
                }
                const checkPassword = await verifyPassword(credentials.password, result.password);
                if (!checkPassword || result.email !== credentials.email) {
                    throw new Error("Email or Password doesn't match");
                }

                return result;
            }
        })
    ],

    callbacks: {
        async jwt({ token }) {
            return token;
        },
        // 세션에 로그인한 유저 데이터 입력
        async session({ session }) {
            return session;
        },
    },
    session: {
        strategy: 'jwt'
    },

    secret: process.env.NEXTAUTH_SECRET,

})

