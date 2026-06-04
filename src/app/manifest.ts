
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Muawin | گھر کے کام، اب آسان',
    short_name: 'Muawin',
    description: 'Muawin connects you with verified local service providers in Pakistan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#088771',
    icons: [
      {
        src: 'https://picsum.photos/seed/muawin-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/muawin-icon/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
