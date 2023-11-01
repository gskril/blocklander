import '@rainbow-me/rainbowkit/styles.css'

import { FooterLink } from '@/components/FooterLink'
import { ClientProviders } from '@/lib/providers'

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div
            className="flex flex-col items-center p-4 sm:px-6 w-full lg:max-w-6xl mx-auto"
            style={{
              minHeight: '100svh', // safe view height, tailwind doesn't support it
            }}
          >
            <div />

            <div className="flex flex-grow items-center">{children}</div>

            <footer>
              <span className="text-[#9b9ba6]">
                by{' '}
                <FooterLink href="https://warpcast.com/greg">Greg</FooterLink>{' '}
                and{' '}
                <FooterLink href="https://warpcast.com/brenner">
                  Brenner
                </FooterLink>
              </span>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
