import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const scopeForRegistration = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
].join(' ')

const scopeForLogin = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ')

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: scopeForRegistration,
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: '',
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
            bio: '',
            schedule_id: '',
          }
        },
      }),
    ],
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
      async signIn({ account, user }) {
        // const userExists = await prisma.user.findUnique({
        //   where: {
        //     email: user.email,
        //   },
        // })

        // const userWithRefreshToken = await prisma.account.findFirst({
        //   where: {
        //     user: {
        //       email: user.email,
        //     },
        //   },
        //   select: {
        //     refresh_token: true,
        //   },
        // })

        // if (!userWithRefreshToken) {
        //   if (account) {
        //     account.scope = `${account.scope} https://www.googleapis.com/auth/calendar`
        //   }
        //   scopeForLogin.push('https://www.googleapis.com/auth/calendar')
        // }

        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          return '/register/connect-calendar?error=permissions'
        }

        return true
      },
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res))
}
