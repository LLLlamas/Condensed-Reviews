import { Libre_Caslon_Text, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import '../src/App.css';

const libreCaslon = Libre_Caslon_Text({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-brand' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-body' });

export const metadata = {
  title: 'Court Report — Basketball & Running Shoe Reviews',
  description: 'Real user reviews from Reddit, condensed and rated across 8 performance traits.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
