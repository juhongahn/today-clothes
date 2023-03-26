import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from '../../../../public/mongoClient.js';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GitHub_ID,
            clientSecret: process.env.GitHub_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    /**
     * JWT Callback
     * 웹 토큰이 실행 혹은 업데이트될때마다 콜백이 실행
     * 반환된 값은 암호화되어 쿠키에 저장됨
     */
    async jwt({ token, account, user }) {
        // 초기 로그인시 User 정보를 가공해 반환
        if (account && user) {
            return {
                accessToken: account.access_token,
                accessTokenExpires: account.expires_at,
                refreshToken: account.refresh_token,
                user,
            }
        }
        return token
    },

    /**
     * Session Callback
     * ClientSide에서 NextAuth에 세션을 체크할때마다 실행
     * 반환된 값은 useSession을 통해 ClientSide에서 사용할 수 있음
     * JWT 토큰의 정보를 Session에 유지 시킨다.
     */
    async session({ session, token }) {
        session.user = token.user
        session.accessToken = token.accessToken
        session.accessTokenExpires = token.accessTokenExpires
        session.error = token.error
        return session
    },

    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
})

