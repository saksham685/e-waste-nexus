import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VoiceCompanion } from '@/components/VoiceCompanion';
import { NexusGPTChat } from '@/components/NexusGPTChat';
import './globals.css';

// Lazy load Three.js background for optimal SSR hydration & code splitting (Unit V)
const CyberBackground3D = dynamic(
  () => import('@/components/CyberBackground3D').then((mod) => mod.CyberBackground3D),
  { ssr: false }
);

export const metadata: Metadata = {
  title: {
    default: 'E-Waste Nexus | Circular Electronics Operating System',
    template: '%s | E-Waste Nexus',
  },
  description:
    'Next.js 14 powered closed-loop e-waste recycling, Extended Producer Responsibility (EPR) credit governance, 3D interactive hardware deconstruction, and AI voice assistance.',
  keywords: [
    'e-waste recycling',
    'EPR credits',
    'urban mining',
    'gold recovery',
    'circular electronics',
    'Next.js 14 App Router',
    'Three.js 3D',
  ],
  authors: [{ name: 'E-Waste Nexus Circular Foundation' }],
  creator: 'E-Waste Nexus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ewastenexus.internal',
    title: 'E-Waste Nexus | Next.js Circular Electronics Platform',
    description:
      'Transform electronic waste into certified gold bullion, strategic metals, and statutory EPR compliance credits.',
    siteName: 'E-Waste Nexus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Waste Nexus | Circular Electronics OS',
    description: 'Transform electronic waste with verified chain-of-custody tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0f0d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-nexus-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-nexus-dark">
        {/* Three.js Cybernetic Background Grid */}
        <CyberBackground3D />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10">{children}</main>

        {/* Global Floating AI Voice Companion */}
        <VoiceCompanion />

        {/* Global NexusGPT AI Conversational Chat */}
        <NexusGPTChat />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
