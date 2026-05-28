# Prompt để paste vào Kiro

```text
You are implementing the MVP for "Nhà Nhỏ Vận Động" / `little-steps-home`.

Read all project documentation before writing code:
- 00_README_IMPORT_TO_KIRO.md
- .kiro/steering/product.md
- .kiro/steering/tech.md
- .kiro/steering/structure.md
- .kiro/steering/child-safety-and-content.md
- .kiro/specs/little-steps-home/requirements.md
- .kiro/specs/little-steps-home/design.md
- .kiro/specs/little-steps-home/tasks.md
- .kiro/specs/little-steps-home/content-catalog.md
- .kiro/specs/little-steps-home/release-checklist.md

Implementation rules:
1. Treat the spec and steering files as authoritative.
2. Build only the MVP. Do not add Supabase, authentication, analytics, push notifications, payments, ads, camera, AI pose detection, social sharing, multi-child profiles or free-form drag/drop.
3. Use Next.js App Router + TypeScript + Tailwind CSS, Zustand persisted local state, Zod validation, Motion animations, YouTube IFrame Player API, a minimal PWA service worker and Vercel-compatible configuration.
4. Use Vietnamese for child-facing UI copy and English for code identifiers.
5. Keep YouTube IDs as replaceable seed data. Use placeholder-safe behavior until real parent-approved IDs are provided.
6. Implement tasks strictly in the order in tasks.md. After each completed task:
   - run relevant lint/type/test/build checks;
   - report files changed;
   - update the task checkbox only when its acceptance criteria pass.
7. Before coding, briefly review requirements/design/tasks for contradictions. Propose only essential corrections; do not broaden scope.
8. Start with Phase 0 and Phase 1 tasks. Stop at the end of each milestone for review unless instructed to continue.
```
