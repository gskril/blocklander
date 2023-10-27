import '@rainbow-me/rainbowkit/styles.css'

import './globals.css'
import { ClientProviders } from '@/lib/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="flex flex-col justify-center items-center p-6 min-h-screen w-full lg:max-w-6xl my-0 mx-auto"
        style={{
          minHeight: '100svh', // safe view height, tailwind doesn't support it
        }}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
