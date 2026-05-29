import type { Mission } from '@/types/domain';

export const missions: Mission[] = [
  {
    id: 'mission-01',
    order: 1,
    title: 'Bước Chân Đầu Tiên',
    kidTitle: 'Bước Chân Đầu Tiên',
    story: 'Khởi động nhẹ nhàng cùng bạn thú nào!',
    youtubeVideoId: 'Fs9Etga5-rk',
    durationMinutes: 3,
    difficulty: 'easy',
    rewardStars: 1,
    requiredReps: 3,
    parentSafetyNote: 'Tập trên nền không trơn, có người lớn bên cạnh.',
    isActive: true,
  },
  {
    id: 'mission-02',
    order: 2,
    title: 'Vượt Suối Lấp Lánh',
    kidTitle: 'Vượt Suối Lấp Lánh',
    story: 'Nhảy qua suối cùng bạn thú nhé!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_02',
    durationMinutes: 4,
    difficulty: 'easy',
    rewardStars: 1,
    requiredReps: 3,
    parentSafetyNote: 'Quan sát bé nếu bài có động tác nhảy.',
    isActive: true,
  },
  {
    id: 'mission-03',
    order: 3,
    title: 'Leo Đồi Tìm Sao',
    kidTitle: 'Leo Đồi Tìm Sao',
    story: 'Cùng leo cao để tìm ngôi sao!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_03',
    durationMinutes: 4,
    difficulty: 'easy',
    rewardStars: 1,
    requiredReps: 3,
    parentSafetyNote: 'Cho bé nghỉ nếu thấy mệt hoặc khó chịu.',
    isActive: true,
  },
  {
    id: 'mission-04',
    order: 4,
    title: 'Giữ Cầu Thật Vững',
    kidTitle: 'Giữ Cầu Thật Vững',
    story: 'Giữ thăng bằng thật giỏi nhé!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_04',
    durationMinutes: 4,
    difficulty: 'medium',
    rewardStars: 1,
    requiredReps: 3,
    parentSafetyNote: 'Cần người lớn quan sát nếu có giữ thăng bằng.',
    isActive: true,
  },
  {
    id: 'mission-05',
    order: 5,
    title: 'Vũ Điệu Trong Vườn',
    kidTitle: 'Vũ Điệu Trong Vườn',
    story: 'Nhảy múa trong vườn hoa nào!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_05',
    durationMinutes: 5,
    difficulty: 'medium',
    rewardStars: 2,
    requiredReps: 3,
    parentSafetyNote: 'Chừa đủ không gian vận động xung quanh bé.',
    isActive: true,
  },
  {
    id: 'mission-06',
    order: 6,
    title: 'Đường Đua Vui Vẻ',
    kidTitle: 'Đường Đua Vui Vẻ',
    story: 'Chạy thật nhanh trên đường đua!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_06',
    durationMinutes: 5,
    difficulty: 'medium',
    rewardStars: 2,
    requiredReps: 3,
    parentSafetyNote: 'Dừng nếu bé trượt chân hoặc thấy đau.',
    isActive: true,
  },
  {
    id: 'mission-07',
    order: 7,
    title: 'Mở Rương Kho Báu',
    kidTitle: 'Mở Rương Kho Báu',
    story: 'Bài cuối cùng — mở rương kho báu!',
    youtubeVideoId: 'VIDEO_ID_TO_BE_SUPPLIED_07',
    durationMinutes: 5,
    difficulty: 'medium',
    rewardStars: 2,
    requiredReps: 3,
    parentSafetyNote: 'Phụ huynh cùng bé hoàn thành buổi cuối thật vui.',
    isActive: true,
  },
];

export function getMissionById(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getMissionByOrder(order: number): Mission | undefined {
  return missions.find((m) => m.order === order && m.isActive);
}

export function getNextMission(completedMissionIds: string[]): Mission | undefined {
  return missions.find(
    (m) => m.isActive && !completedMissionIds.includes(m.id)
  );
}

export function getTotalMissions(): number {
  return missions.filter((m) => m.isActive).length;
}
