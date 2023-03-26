import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            /** signin() 함수가 호출되면 authorize 메서드가 호출된다. */
            async authorize(credentials, req) {

                const user = await prisma.user.findUnique({
                    where: {
                        email: String(credentials.email),
                    },
                    select: {
                        email: true, password: true
                    },
                });

                if (!user) {
                    throw new Error('No user found!');
                }

                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error('Could not log you in!');
                }
                return { name: user.name, email: user.email };
            }
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            return token;
        },
        // 세션에 로그인한 유저 데이터 입력
        async session({ session }) {
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

