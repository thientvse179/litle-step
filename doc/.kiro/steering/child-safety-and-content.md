---
inclusion: always
---

# Child Safety, Privacy and Content Steering

## Purpose

This app is designed for a child to follow movement videos. Safety and privacy requirements override feature convenience.

## Non-negotiable privacy rules

- No camera or microphone access.
- No recording, pose detection or biometric inference.
- No login and no remote progress collection in MVP.
- No analytics, ad pixels, advertising SDKs or third-party behavioral tracking.
- Optional nickname remains on the local device only.
- Do not expose outbound browsing paths in the child flow.

## YouTube content rules

Before replacing a placeholder video with a real ID, the parent/developer must:

1. Watch the full video.
2. Verify movements are suitable for the child and intended leg-exercise use.
3. Note whether adult supervision is needed.
4. Confirm the video can play when embedded.
5. Check for distracting, inappropriate or overly demanding instructions.

Player requirements:
- Use privacy-enhanced embed mode.
- Load iframe only after a start tap.
- Do not autoplay.
- Do not attempt to cache or download videos.
- Display an online-required message when offline.
- Before public distribution, review YouTube child-directed/app requirements and applicable policies.

## Physical-safety copy to show before missions

Use a short parent-facing note near mission entry:

> Bé nên tập ở nơi rộng, nền không trơn và có người lớn quan sát. Dừng lại nếu bé thấy đau hoặc khó chịu.

## Motivation rules

Allowed:
- Celebrate completion.
- Let the child see a predictable reward.
- Support rest, stopping and returning another day.
- Use creative decoration and exploration.

Forbidden:
- Penalties for missed days.
- Streak-loss threats.
- Wording that says the character is sad, lonely or harmed because the child did not exercise.
- Competitive comparison with other children.
- Weight, body shape or calorie language.
- Randomized reward boxes or paid unlocks.

## UI safety requirements

- Persistent easy-to-find `Con cần nghỉ` or `Dừng buổi tập` control while playing.
- Parent/reset/settings actions require adult-friction interaction such as a long press.
- Errors must not encourage repeated tapping or accidentally award progress.
- Motion effects must be calm and respect reduced-motion settings.

## Release gate

Do not call the app ready for real child use until:
- every configured video is reviewed;
- safety notes are complete;
- player failure cannot award rewards;
- no tracking dependencies are present;
- install/offline behavior is checked on the target family device.
