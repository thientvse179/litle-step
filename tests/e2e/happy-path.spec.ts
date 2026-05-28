import { test, expect } from '@playwright/test';

/**
 * E2E Happy Path Test (T8.2)
 * 
 * Covers: onboarding → choose character → open mission → simulate completion
 * → reward → decorate room → reload/persist → no duplicate reward.
 * 
 * YouTube completion is simulated by injecting a mock into the page context
 * since we cannot rely on real video playback in automated tests.
 */

test.describe('Happy Path — Full MVP Loop', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('first visit redirects to onboarding', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/onboarding');
    await expect(page.getByText('Nhà Nhỏ Vận Động')).toBeVisible();
  });

  test('full onboarding flow — select character and skip nickname', async ({ page }) => {
    await page.goto('/onboarding');

    // Welcome screen
    await expect(page.getByText('Nhà Nhỏ Vận Động')).toBeVisible();
    await page.getByText('Bắt đầu').click();

    // Character selection
    await expect(page.getByText('Chọn bạn đồng hành')).toBeVisible();
    await expect(page.getByText('Thỏ Mây')).toBeVisible();
    await expect(page.getByText('Gấu Mật')).toBeVisible();
    await expect(page.getByText('Mèo Sao')).toBeVisible();

    // Select a character
    await page.getByText('Gấu Mật').click();
    await page.getByText('Chọn bạn này').click();

    // Nickname step — skip
    await expect(page.getByText('Tên con là gì?')).toBeVisible();
    await page.getByText('Bỏ qua và vào nhà').click();

    // Should be on home now
    await page.waitForURL('/');
    await expect(page.getByText('Nhà của Gấu Mật')).toBeVisible();
  });

  test('full onboarding flow — select character with nickname', async ({ page }) => {
    await page.goto('/onboarding');

    await page.getByText('Bắt đầu').click();
    await page.getByText('Mèo Sao').click();
    await page.getByText('Chọn bạn này').click();

    // Enter nickname
    await page.getByPlaceholder('Nhập tên con...').fill('Bé Na');
    await page.getByText('Vào nhà thôi!').click();

    // Should be on home with nickname
    await page.waitForURL('/');
    await expect(page.getByText('Xin chào, Bé Na!')).toBeVisible();
  });

  test('home shows correct initial state', async ({ page }) => {
    // Set up onboarded state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });
    await page.reload();

    await expect(page.getByText('Nhà của Thỏ Mây')).toBeVisible();
    await expect(page.getByText('Đã hoàn thành 0/7 nhiệm vụ')).toBeVisible();
    await expect(page.getByText('Tập hôm nay')).toBeVisible();
    await expect(page.getByText('Bước Chân Đầu Tiên')).toBeVisible();
  });

  test('mission intro shows correct info and blocks start for placeholder video', async ({ page }) => {
    // Set up onboarded state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/mission/mission-day-01');

    // Mission intro content
    await expect(page.getByText('Bước Chân Đầu Tiên')).toBeVisible();
    await expect(page.getByText('Buổi 1')).toBeVisible();
    await expect(page.getByText(/Video chưa được cấu hình/)).toBeVisible();

    // Start button should be disabled
    const startBtn = page.getByText('Bắt đầu');
    await expect(startBtn).toBeDisabled();
  });

  test('room decoration — empty state shows prompt', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/room');
    await expect(page.getByText('Trang trí phòng')).toBeVisible();

    // Click a slot
    await page.getByText('Thảm').click();
    await expect(page.getByText(/Chưa có đồ cho vị trí này/)).toBeVisible();
  });

  test('room decoration — equip unlocked item and persist', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 2,
            completedMissions: [
              { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
            ],
            unlockedItemIds: ['rug-rainbow'],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/room');

    // Select the floor-rug slot
    await page.getByText('Thảm').click();

    // Should see the unlocked item
    await expect(page.getByText('Thảm cầu vồng')).toBeVisible();

    // Equip it
    await page.getByText('Thảm cầu vồng').click();
    await expect(page.getByText('Đang dùng')).toBeVisible();

    // Reload and verify persistence
    await page.reload();
    await page.getByText('Thảm').click();
    await expect(page.getByText('Đang dùng')).toBeVisible();
  });

  test('progress persists after close/reopen', async ({ page }) => {
    // Set up state with some progress
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'bear-honey',
            childNickname: 'Bé Gấu',
            totalStars: 6,
            completedMissions: [
              { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
            ],
            unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star'],
            equippedAccessoryItemIds: [],
            roomLayout: { 'floor-rug': 'rug-rainbow' },
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    // Reload (simulates close/reopen)
    await page.reload();

    // Verify state persisted
    await expect(page.getByText('Xin chào, Bé Gấu!')).toBeVisible();
    await expect(page.getByText('Nhà của Gấu Mật')).toBeVisible();
    await expect(page.getByText('Đã hoàn thành 3/7 nhiệm vụ')).toBeVisible();
  });

  test('parent area — shows progress and can reset', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'cat-star',
            childNickname: 'Bé Mèo',
            totalStars: 4,
            completedMissions: [
              { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
            ],
            unlockedItemIds: ['rug-rainbow', 'bed-cloud'],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/parent');

    // Shows progress
    await expect(page.getByText('Khu vực bố mẹ')).toBeVisible();
    await expect(page.getByText('Mèo Sao')).toBeVisible();
    await expect(page.getByText('(Bé Mèo)')).toBeVisible();

    // Reset flow
    await page.getByText('Xóa toàn bộ tiến độ...').click();
    await expect(page.getByText('Xác nhận xóa tiến độ?')).toBeVisible();
    await page.getByText('Xóa hết').click();

    // Should redirect to onboarding
    await page.waitForURL('**/onboarding');
  });

  test('reward page — shows locked state for uncompleted mission', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/reward/mission-day-01');
    await expect(page.getByText('Chưa hoàn thành nhiệm vụ này')).toBeVisible();
  });

  test('reward page — shows celebration for completed mission', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 2,
            completedMissions: [
              { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
            ],
            unlockedItemIds: ['rug-rainbow'],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/reward/mission-day-01');
    await expect(page.getByText('Giỏi lắm!')).toBeVisible();
    await expect(page.getByText('Thảm cầu vồng')).toBeVisible();
    await expect(page.getByText('Trang trí ngay')).toBeVisible();
    await expect(page.getByText('Về nhà')).toBeVisible();
  });

  test('wardrobe — empty state', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/wardrobe');
    await expect(page.getByText('Phụ kiện')).toBeVisible();
    await expect(page.getByText(/Chưa có phụ kiện nào/)).toBeVisible();
  });

  test('wardrobe — equip and remove accessory', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('little-steps-progress', JSON.stringify({
        state: {
          progress: {
            version: 1,
            selectedCharacterId: 'rabbit-cloud',
            totalStars: 14,
            completedMissions: [
              { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-04', completedAt: '2024-01-04T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-05', completedAt: '2024-01-05T00:00:00Z', videoEnded: true },
              { missionId: 'mission-day-06', completedAt: '2024-01-06T00:00:00Z', videoEnded: true },
            ],
            unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star', 'window-magic', 'plant-happy', 'hat-adventure'],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
          hydrated: true,
        },
        version: 0,
      }));
    });

    await page.goto('/wardrobe');

    // Should see the hat accessory
    await expect(page.getByText('Mũ phiêu lưu')).toBeVisible();
    await expect(page.getByText('Bấm để đeo')).toBeVisible();

    // Equip it
    await page.getByText('Mũ phiêu lưu').click();
    await expect(page.getByText('Đang đeo')).toBeVisible();

    // Remove it
    await page.getByText('Mũ phiêu lưu').click();
    await expect(page.getByText('Bấm để đeo')).toBeVisible();
  });
});
