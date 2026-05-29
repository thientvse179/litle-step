import type { Item, DailyReward } from '@/types/domain';

export const items: Item[] = [
  // Room decoration items (daily rewards)
  {
    id: 'rug-rainbow',
    name: 'Thảm cầu vồng',
    type: 'room-decoration',
    imageSrc: '/assets/items/rug-rainbow.svg',
    roomSlotId: 'floor-rug',
    unlockSource: 'daily-reward',
  },
  {
    id: 'bed-cloud',
    name: 'Giường đám mây',
    type: 'room-decoration',
    imageSrc: '/assets/items/bed-cloud.svg',
    roomSlotId: 'bed',
    unlockSource: 'daily-reward',
  },
  {
    id: 'lamp-star',
    name: 'Đèn ngôi sao',
    type: 'room-decoration',
    imageSrc: '/assets/items/lamp-star.svg',
    roomSlotId: 'lamp',
    unlockSource: 'daily-reward',
  },
  {
    id: 'window-magic',
    name: 'Cửa sổ phép thuật',
    type: 'room-decoration',
    imageSrc: '/assets/items/window-magic.svg',
    roomSlotId: 'window',
    unlockSource: 'daily-reward',
  },
  {
    id: 'plant-happy',
    name: 'Chậu cây vui vẻ',
    type: 'room-decoration',
    imageSrc: '/assets/items/plant-happy.svg',
    roomSlotId: 'plant',
    unlockSource: 'daily-reward',
  },
  {
    id: 'toy-treasure-chest',
    name: 'Rương kho báu',
    type: 'room-decoration',
    imageSrc: '/assets/items/toy-treasure-chest.svg',
    roomSlotId: 'toy',
    unlockSource: 'daily-reward',
  },
  // Character accessories (daily rewards)
  {
    id: 'hat-adventure',
    name: 'Mũ phiêu lưu',
    type: 'character-accessory',
    imageSrc: '/assets/items/hat-adventure.svg',
    compatibleCharacterIds: ['rabbit-cloud', 'bear-honey', 'cat-star'],
    unlockSource: 'daily-reward',
  },
];

/** Daily rewards cycle — bé nhận quà khác nhau mỗi ngày hoàn thành full */
export const dailyRewards: DailyReward[] = [
  { dayIndex: 0, itemId: 'rug-rainbow', bonusStars: 3 },
  { dayIndex: 1, itemId: 'bed-cloud', bonusStars: 3 },
  { dayIndex: 2, itemId: 'lamp-star', bonusStars: 3 },
  { dayIndex: 3, itemId: 'window-magic', bonusStars: 4 },
  { dayIndex: 4, itemId: 'plant-happy', bonusStars: 4 },
  { dayIndex: 5, itemId: 'hat-adventure', bonusStars: 5 },
  { dayIndex: 6, itemId: 'toy-treasure-chest', bonusStars: 5 },
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

/** Get today's daily reward based on total days completed (cycles through list) */
export function getDailyReward(totalDaysCompleted: number): DailyReward {
  const index = totalDaysCompleted % dailyRewards.length;
  return dailyRewards[index];
}
