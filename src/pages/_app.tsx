import '@/styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Exo, Nunito } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'

import { ToastProvider } from '@/contexts/toast-context'
import { queryClient } from '@/lib/react-query'

const exo = Exo({ subsets: ['latin'], variable: '--font-exo' })

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main
      className={`${exo.variable} ${nunito.variable} bg-zinc-900 font-sans`}
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </SessionProvider>
      </QueryClientProvider>
    </main>
  )
}
