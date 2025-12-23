# 🏔️ The Mountain Pathway

A guided digital reflection experience inspired by the metaphor of climbing a mountain. Users journey through contemplative steps—reading scripture, reflecting, praying, and resting in silence—while ambient music creates a meditative atmosphere.

**Live Site:** [www.themountainpathway.com](https://www.themountainpathway.com)

---

## ✨ Features

### Core Experience

- **9-Step Guided Journey** — Scripture reading, reflection prompts, prayer, and silent meditation
- **Ambient Audio** — Calming background music for the meditative experience
- **Meditation Timer** — Configurable silence timer (1-10 minutes) with visual countdown
- **PDF Export** — Download your completed journey as a formatted PDF

### User Accounts

- **Guest Mode** — Complete journeys without signing up
- **User Authentication** — Sign up/login via Supabase Auth
- **Save & Resume** — Save journeys to the cloud, continue later
- **Journey Archive** — View and manage saved journeys

### Design

- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Mountain Climb Metaphor** — Visual progress indicator showing ascent
- **Dark/Light Themes** — Consistent brand aesthetic
- **Smooth Animations** — Framer Motion transitions between steps

---

## 🛠️ Tech Stack

| Category             | Technology                                                                  |
| -------------------- | --------------------------------------------------------------------------- |
| **Framework**        | [Next.js 15](https://nextjs.org/) (App Router, Turbopack)                   |
| **Language**         | TypeScript                                                                  |
| **Styling**          | [Tailwind CSS 4](https://tailwindcss.com/)                                  |
| **UI Components**    | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) (with persist middleware)          |
| **Authentication**   | [Supabase Auth](https://supabase.com/auth)                                  |
| **Database**         | [Supabase](https://supabase.com/) (PostgreSQL)                              |
| **Animations**       | [Framer Motion](https://www.framer.com/motion/)                             |
| **PDF Generation**   | [jsPDF](https://github.com/parallax/jsPDF)                                  |
| **Icons**            | [Lucide React](https://lucide.dev/)                                         |
| **Deployment**       | [Vercel](https://vercel.com/)                                               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for authentication & database)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/the-mountain-pathway.git
   cd the-mountain-pathway
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
the-mountain-pathway/
├── docs/                          # Documentation
│   ├── CAPACITOR_NATIVE_APP_PLAN.md
│   ├── SAVE_LOAD_FLOW.md
│   └── SUPABASE_EMAIL_CONFIG.md
├── public/
│   └── audio/                     # Ambient music files
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── auth/
│   │   │   ├── callback/          # OAuth callback handler
│   │   │   └── confirm/           # Email verification handler
│   │   ├── data-deletion/         # Data deletion policy page
│   │   ├── login/                 # Login page
│   │   ├── privacy/               # Privacy policy page
│   │   ├── reset-password/        # Password reset page
│   │   ├── terms/                 # Terms of service page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Homepage
│   ├── components/
│   │   ├── ui/                    # Reusable UI components (shadcn)
│   │   ├── AuthModal.tsx          # Authentication modal
│   │   ├── HomeClient.tsx         # Main app orchestrator
│   │   ├── InputScreen.tsx        # User reflection input
│   │   ├── JourneyScreen.tsx      # Scripture/content display
│   │   ├── LandingPage.tsx        # Homepage hero
│   │   ├── ProgressPath.tsx       # Mountain climb visual
│   │   ├── ReflectionScreen.tsx   # Reflection prompts
│   │   ├── SavedJourneysView.tsx  # Journey archive
│   │   ├── SoftGateModal.tsx      # Sign up/login prompt
│   │   ├── SummaryScreen.tsx      # Journey completion
│   │   └── TimerScreen.tsx        # Meditation timer
│   ├── hooks/
│   │   └── useAudioPlayer.ts      # Audio playback hook
│   ├── lib/
│   │   ├── data/
│   │   │   └── steps.ts           # Journey step definitions
│   │   ├── store/
│   │   │   └── useStore.ts        # Zustand global store
│   │   ├── journeyApi.ts          # Supabase journey CRUD
│   │   ├── pathway-data.ts        # Content data
│   │   ├── supabaseClient.ts      # Supabase client
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── index.ts               # TypeScript types
├── .env.local                     # Environment variables (not committed)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Authentication Flow

The app supports three user states:

| State             | Description                                               |
| ----------------- | --------------------------------------------------------- |
| **Guest**         | Complete journeys without an account (local storage only) |
| **Anonymous**     | Started as guest, journey saved locally                   |
| **Authenticated** | Full account with cloud-saved journeys                    |

### Auth Endpoints

- `/auth/callback` — Handles OAuth redirects
- `/auth/confirm` — Handles email verification & password reset tokens
- `/reset-password` — Password reset form

See [docs/SUPABASE_EMAIL_CONFIG.md](docs/SUPABASE_EMAIL_CONFIG.md) for email configuration.

---

## 💾 Data Persistence

| Storage           | Data                                  | When                     |
| ----------------- | ------------------------------------- | ------------------------ |
| **Local Storage** | Current journey progress, preferences | Always (Zustand persist) |
| **Supabase**      | Saved journeys, user profiles         | Authenticated users      |

See [docs/SAVE_LOAD_FLOW.md](docs/SAVE_LOAD_FLOW.md) for detailed save/load architecture.

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Build Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📧 Email Configuration

Transactional emails (password reset, confirmation) are sent via **Resend** SMTP through Supabase.

See [docs/SUPABASE_EMAIL_CONFIG.md](docs/SUPABASE_EMAIL_CONFIG.md) for setup instructions.

---

## 📱 Native App (Future)

Plans exist to wrap this web app as native iOS/Android apps using **Capacitor**.

See [docs/CAPACITOR_NATIVE_APP_PLAN.md](docs/CAPACITOR_NATIVE_APP_PLAN.md) for the roadmap.

---

## 📜 Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start development server (Turbopack) |
| `npm run build` | Build for production                 |
| `npm run start` | Start production server              |
| `npm run lint`  | Run ESLint                           |

---

## 🎨 Brand Colors

| Color             | Hex       | Usage                |
| ----------------- | --------- | -------------------- |
| **Brand Gold**    | `#D4A574` | Primary accent, CTAs |
| **Brand Slate**   | `#334155` | Text, backgrounds    |
| **Mountain Blue** | `#1E3A5F` | Dark backgrounds     |

---

## 📄 Legal Pages

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
- [Data Deletion](/data-deletion)

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

- **Email:** hello@themountainpathway.com
- **Website:** [www.themountainpathway.com](https://www.themountainpathway.com)
- **Created by:** [webdevbyrau](https://www.webdevbyrau.com)

---

## ☕ Support

If The Mountain Pathway has been meaningful to you, consider supporting the project:

[Buy Me a Coffee](https://buymeacoffee.com/themountainpathway)

---

## 📝 License

This project is proprietary software. All rights reserved.

---

_"The journey of a thousand miles begins with a single step."_ — Lao Tzu
