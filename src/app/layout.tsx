import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Footer, Header, SkipLink } from '@/components/shared'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// metadata: Define metadatos para SEO a nivel de aplicacion.
// title.template permite usar %s como placeholder para titulos de paginas hijas.
export const metadata: Metadata = {
  title: {
    template: '%s | ILEGALES',
    default: 'ILEGALES - Tienda Urbana',
  },
  description:
    'ILEGALES Tienda Urbana - Tattoo, Graffiti, Galería, Artículos y Accesorios, Stickers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // lang="es": Importante para accesibilidad y SEO en sitios en español
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        {/* SkipLink: Accesibilidad - permite saltar la navegacion */}
        <SkipLink />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
