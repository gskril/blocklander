import './globals.css'
import { ClientProviders } from '@/lib/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center p-6 min-h-screen w-full lg:max-w-6xl my-0 mx-auto">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
