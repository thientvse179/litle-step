import type { Character } from '@/types/domain';

export const characters: Character[] = [
  {
    id: 'rabbit-cloud',
    name: 'Thỏ Mây',
    description: 'Thích nhảy và trồng hoa',
    avatarSrc: '/assets/characters/rabbit-cloud.svg',
    roomBackgroundSrc: '/assets/rooms/room-rainbow.svg',
  },
  {
    id: 'bear-honey',
    name: 'Gấu Mật',
    description: 'Thích vận động và khám phá',
    avatarSrc: '/assets/characters/bear-honey.svg',
    roomBackgroundSrc: '/assets/rooms/room-wood.svg',
  },
  {
    id: 'cat-star',
    name: 'Mèo Sao',
    description: 'Thích giữ thăng bằng và ngắm trời',
    avatarSrc: '/assets/characters/cat-star.svg',
    roomBackgroundSrc: '/assets/rooms/room-night.svg',
  },
];

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
