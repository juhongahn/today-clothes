import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";
import async from './../hello';

let prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            /** signin() 함수가 호출되면 authorize 메서드가 호출된다. */
            async authorize(credentials, req) {

            }
        })
    ],


    callbacks: {


        // 세션에 로그인한 유저 데이터 입력
        async session({ session, token, user }) {
            const exUser = await prisma.user.findUnique({
                where: { email: session.user?.email },
                select: {
                    id: true,
                    email: true,
                },
            });

            // 로그인한 유저 데이터 재정의
            // 단, 기존에 "user"의 형태가 정해져있기 때문에 변경하기 위해서는 타입 재정의가 필요함
            session.user = exUser;

            // 여기서 반환한 session값이 "useSession()"의 "data"값이 됨
            return session;
        },
    },
    secret: process.env.SECRET,

})

