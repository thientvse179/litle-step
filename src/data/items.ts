import type { Item } from '@/types/domain';

export const items: Item[] = [
  // Room decoration items
  {
    id: 'rug-rainbow',
    name: 'Thảm cầu vồng',
    type: 'room-decoration',
    imageSrc: '/assets/items/rug-rainbow.svg',
    roomSlotId: 'floor-rug',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-01',
  },
  {
    id: 'bed-cloud',
    name: 'Giường đám mây',
    type: 'room-decoration',
    imageSrc: '/assets/items/bed-cloud.svg',
    roomSlotId: 'bed',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-02',
  },
  {
    id: 'lamp-star',
    name: 'Đèn ngôi sao',
    type: 'room-decoration',
    imageSrc: '/assets/items/lamp-star.svg',
    roomSlotId: 'lamp',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-03',
  },
  {
    id: 'window-magic',
    name: 'Cửa sổ phép thuật',
    type: 'room-decoration',
    imageSrc: '/assets/items/window-magic.svg',
    roomSlotId: 'window',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-04',
  },
  {
    id: 'plant-happy',
    name: 'Chậu cây vui vẻ',
    type: 'room-decoration',
    imageSrc: '/assets/items/plant-happy.svg',
    roomSlotId: 'plant',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-05',
  },
  {
    id: 'toy-treasure-chest',
    name: 'Rương kho báu',
    type: 'room-decoration',
    imageSrc: '/assets/items/toy-treasure-chest.svg',
    roomSlotId: 'toy',
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-07',
  },
  // Character accessories
  {
    id: 'hat-adventure',
    name: 'Mũ phiêu lưu',
    type: 'character-accessory',
    imageSrc: '/assets/items/hat-adventure.svg',
    compatibleCharacterIds: ['rabbit-cloud', 'bear-honey', 'cat-star'],
    unlockSource: 'mission',
    unlockMissionId: 'mission-day-06',
  },
];

export function getItemById(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getItemsForSlot(slotId: string, unlockedItemIds: string[]): Item[] {
  return items.filter(
    (i) =>
      i.type === 'room-decoration' &&
      i.roomSlotId === slotId &&
      unlockedItemIds.includes(i.id)
  );
}

export function getUnlockedAccessories(unlockedItemIds: string[]): Item[] {
  return items.filter(
    (i) => i.type === 'character-accessory' && unlockedItemIds.includes(i.id)
  );
}
