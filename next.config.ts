import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents: true - Habilita Cache Components y PPR (Partial Prerendering).
  // Permite usar 'use cache' en componentes para crear shells estaticos
  // con "holes" dinamicos que se streaman despues.
  // Reemplaza el antiguo experimental.ppr de Next.js 15.
  cacheComponents: true,
}

export default nextConfig
