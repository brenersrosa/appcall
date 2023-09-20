import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
    bio: string
    schedule_id: string
  }

  interface Session {
    user: User
  }
}
