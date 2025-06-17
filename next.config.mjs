/** @type {import('next').NextConfig} */
const nextConfig = {
output: 'export',
trailingSlash: true,
images: {
  unoptimized: true
},
basePath: process.env.NODE_ENV === 'production' ? '/menuyaapp' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/menuyaapp/' : '',
// Configuración adicional para TypeScript y componentes
typescript: {
  ignoreBuildErrors: false,
},
eslint: {
  ignoreDuringBuilds: false,
},
// Configuración para exportación estática
distDir: 'out',
}

export default nextConfig;