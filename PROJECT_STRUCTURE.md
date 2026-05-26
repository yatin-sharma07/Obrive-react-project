# Obrive Project Structure

```
Obrive-react-project/
├── 📄 Configuration Files
│   ├── biome.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── global.d.ts
│   ├── next-env.d.ts
│   ├── components.json
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── Dockerfile.backend
│   └── README.md
│
├── 📁 public/ (Static Assets)
│   ├── ai/
│   │   └── ai.js
│   ├── animations/ (Rive files)
│   ├── audio/
│   ├── images/
│   └── videos/
│
├── 📁 src/ (Frontend - Next.js)
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── (apply)/
│   │   ├── (auth)/
│   │   ├── (company-info)/
│   │   ├── (dashboard)/
│   │   ├── (public)/
│   │   ├── api/
│   │   ├── audio-room/
│   │   ├── client/
│   │   └── profile/
│   ├── assets/
│   │   ├── controllers/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── videos/
│   ├── AUDIO_ROOM/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── livekit/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── store/
│   │   └── types/
│   ├── COMMUNITY/
│   ├── components/
│   │   ├── ConfirmationAlert.tsx
│   │   ├── SkelitonLoading.tsx
│   │   ├── chat/
│   │   ├── dashboard/
│   │   ├── pages/
│   │   ├── shared/
│   │   └── ui/
│   ├── constants/
│   │   ├── dashboardConfig.ts
│   │   ├── Footer.ts
│   │   ├── navigation.ts
│   │   └── pages/
│   ├── content/
│   │   ├── career/
│   │   ├── faq/
│   │   ├── legal/
│   │   ├── resources/
│   │   ├── security/
│   │   └── support/
│   ├── context/
│   │   ├── SocketContext.tsx
│   │   └── TimerContext.tsx
│   ├── features/
│   │   └── auth/
│   ├── hooks/
│   │   ├── useActivityDetection.ts
│   │   ├── useCurrentUser.ts
│   │   ├── useHeartbeat.ts
│   │   └── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── iconMap.tsx
│   │   ├── mdx.ts
│   │   ├── products.ts
│   │   ├── solutions.ts
│   │   ├── useHoverScale.ts
│   │   ├── utils.ts
│   │   └── hooks/
│   └── types/
│       ├── case-study.ts
│       ├── dashboard.ts
│       ├── elevenlabs.d.ts
│       └── video.d.ts
│
└── 📁 backend/ (Node.js/Express API)
    ├── 📄 Configuration & Setup
    │   ├── package.json
    │   ├── server.js
    │   ├── prisma.js
    │   ├── fix_room_configs.js
    │   └── test_prisma.js
    ├── 📁 prisma/
    │   ├── schema.prisma
    │   ├── schema copy.prisma
    │   ├── migrations/
    │   │   ├── migration_lock.toml
    │   │   ├── 20260425130649_add_tasks_created_by_field/
    │   │   ├── 20260430061430_update_leave_status_default/
    │   │   └── 20260522000000_add_audio_participant_state/
    ├── 📁 src/
    │   ├── config/
    │   │   ├── db.js
    │   │   └── multer.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── errorHandler.js
    │   │   ├── rbac.js
    │   │   └── validate.js
    │   ├── jobs/
    │   │   └── workSessionCron.js
    │   ├── modules/ (Domain modules)
    │   │   ├── admin/
    │   │   ├── AUDIO_ROOM/
    │   │   ├── auth/
    │   │   ├── calendar/
    │   │   ├── chat/
    │   │   ├── clients/
    │   │   ├── COMMUNITY/
    │   │   ├── employee/
    │   │   ├── events/
    │   │   ├── hr/
    │   │   ├── leaves/
    │   │   ├── meeting/
    │   │   ├── profile/
    │   │   ├── projects/
    │   │   ├── sticky-notes/
    │   │   ├── supervisor/
    │   │   ├── tasks/
    │   │   └── ... (other modules)
    │   ├── socket/
    │   └── utils/
```

## Project Type & Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+, React, TypeScript, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (via Prisma ORM) |
| **Real-time** | WebSockets, LiveKit (Audio/Video) |
| **Deployment** | Docker (frontend + backend) |
| **Package Manager** | pnpm |

## Key Features
- 🎥 **Audio Room** - Live audio/video rooms with LiveKit
- 👥 **Community** - Community features & interactions
- 📊 **Dashboard** - Employee/company dashboard
- 🔐 **Authentication & RBAC** - Role-based access control
- 💬 **Chat System** - Real-time messaging
- 📅 **Calendar & Events** - Event management
- ✅ **Tasks Management** - Task tracking & assignments
- 🏢 **HR Management** - Leave, attendance, employee management
- 📱 **Responsive Design** - Mobile-optimized UI
