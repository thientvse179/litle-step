import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nhà Nhỏ Vận Động',
    short_name: 'Nhà Nhỏ',
    description: 'Bé tập vận động cùng bạn thú và trang trí ngôi nhà đáng yêu',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef7f0',
    theme_color: '#fef7f0',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
