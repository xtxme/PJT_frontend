// lib/fonts.ts
import { IBM_Plex_Sans_Thai } from 'next/font/google';

export const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-thai',
});
