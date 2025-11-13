# React Native Expo Boilerplate

A production-ready, zero-setup React Native Expo app boilerplate with all the latest libraries and best practices pre-configured. Clone, install dependencies, add credentials, and start building features immediately.

## Features

### Core Stack
- **Expo SDK 54+** with New Architecture enabled
- **Expo Router v8+** with file-based routing, typed routes, and API routes
- **TypeScript 5.3+** with strict mode and path aliases
- **NativeWind v4** for Tailwind CSS styling with dark mode support
- **React Native Reanimated 4** for smooth 120fps animations

### Authentication & Backend
- **Clerk** for complete authentication (sign-up, sign-in, OAuth, email verification, password reset)
- **Supabase** for PostgreSQL database, real-time subscriptions, and storage
- **Expo API Routes** for backend endpoints with authentication and rate limiting middleware

### State Management & Data
- **Zustand 4** for global state management with MMKV persistence
- **TanStack Query v5** for server state, caching, and synchronization
- **MMKV** for fast key-value storage (replacing AsyncStorage)

### Forms & Validation
- **React Hook Form 7** for performant form management
- **Zod** for TypeScript-first schema validation

### Developer Experience
- **Biome** for fast linting and formatting (replacing ESLint + Prettier)
- **Husky + lint-staged** for pre-commit hooks
- **Commitlint** for conventional commit message enforcement
- Path aliases (`@/components`, `@/features`, `@/lib`, `@/types`)

### Utilities & Features
- **i18next** with expo-localization for internationalization and RTL support
- **Sentry** for error monitoring and crash reporting
- **Expo Haptics** for haptic feedback
- **date-fns** for date formatting

## Project Structure

```
my-app/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Auth group
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   ├── forgot-password.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx             # Home screen
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── api/                      # API routes
│   │   ├── health+api.ts
│   │   ├── users/
│   │   │   └── [id]+api.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       └── rateLimit.ts
│   ├── _layout.tsx               # Root layout with providers
│   └── +not-found.tsx
├── src/
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   └── schemas/          # Zod validation schemas
│   │   ├── user/
│   │   └── notes/
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/               # Layout components
│   │       ├── Screen.tsx
│   │       └── Container.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useTheme.ts
│   │   ├── useI18n.ts
│   │   └── useHaptics.ts
│   ├── store/                    # Zustand stores
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   └── uiStore.ts
│   ├── services/                 # External services
│   │   ├── clerk.ts
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── lib/                      # Library configurations
│   │   ├── i18n/
│   │   │   ├── index.ts
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       ├── es.json
│   │   │       └── ar.json
│   │   ├── mmkv.ts
│   │   └── sentry.ts
│   ├── types/                    # TypeScript types
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── navigation.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── constants/                # App constants
│       ├── colors.ts
│       ├── fonts.ts
│       └── spacing.ts
├── assets/                       # Static assets
│   ├── fonts/
│   ├── images/
│   └── icons/
├── .env.local.example            # Environment variables template
├── .env.production.example
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── biome.json                    # Biome configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for builds): `npm install -g eas-cli`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-native-expo-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   - **Clerk**: Get your publishable key from [clerk.com](https://clerk.com)
   - **Supabase**: Get your URL and anon key from [supabase.com](https://supabase.com)
   - **Sentry**: Get your DSN from [sentry.io](https://sentry.io)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on a device or simulator**
   - iOS: Press `i` in the terminal or run `npm run ios`
   - Android: Press `a` in the terminal or run `npm run android`
   - Web: Press `w` in the terminal or run `npm run web`

### Configuration

#### 1. Clerk Authentication

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key to `.env.local`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
4. Configure OAuth providers (optional) in Clerk dashboard

#### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```
3. Set up your database schema and row-level security policies

#### 3. Sentry Error Monitoring

1. Create a project at [sentry.io](https://sentry.io)
2. Copy your DSN to `.env.local`:
   ```
   EXPO_PUBLIC_SENTRY_DSN=https://...@o...ingest.sentry.io/...
   ```

#### 4. EAS Build Configuration

1. Log in to EAS:
   ```bash
   eas login
   ```

2. Configure your project:
   ```bash
   eas build:configure
   ```

3. Update `eas.json` with your specific configuration

## Scripts

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web

# Code Quality
npm run lint           # Run Biome linter
npm run format         # Format code with Biome
npm run check          # Lint and format in one command
npm run type-check     # Run TypeScript type checking

# Building
npm run prebuild       # Generate native projects
npm run build:android  # Build Android app with EAS
npm run build:ios      # Build iOS app with EAS
npm run build:all      # Build both platforms
```

## Architecture

### Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { apiClient } from '@/services';
import type { User } from '@/types';
```

### State Management

- **Zustand** for client state (auth, user preferences, UI state)
- **TanStack Query** for server state (API data, caching)
- **MMKV** for persisting Zustand stores

### Styling

The project uses **NativeWind v4** which brings Tailwind CSS to React Native:

```tsx
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

### Forms

Forms are handled with **React Hook Form** and validated with **Zod**:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### Internationalization

Use the `useI18n` hook to access translations:

```typescript
const { t, changeLanguage } = useI18n();

<Text>{t('auth.signIn')}</Text>
```

Add new languages in `src/lib/i18n/locales/`.

### API Routes

Create API endpoints in the `app/api/` directory:

```typescript
// app/api/example+api.ts
export async function GET(req: ExpoRequest) {
  return Response.json({ message: 'Hello' });
}
```

## Customization

### Theme Colors

Edit `src/constants/colors.ts` to customize your app's color scheme.

### Fonts

1. Add font files to `assets/fonts/`
2. Update `app.json` plugin configuration
3. Update `src/constants/fonts.ts`

### App Name and Bundle ID

1. Update `app.json`:
   - `name`: Display name
   - `slug`: URL-friendly name
   - `ios.bundleIdentifier`: iOS bundle ID
   - `android.package`: Android package name

## Best Practices

1. **Use path aliases** for imports
2. **Follow feature-based structure** for scalable code organization
3. **Use TypeScript strictly** - the project has strict mode enabled
4. **Commit with conventional commits** - enforced by commitlint
5. **Format before committing** - handled by lint-staged
6. **Use Zod schemas** for all form validation
7. **Leverage TanStack Query** for API data fetching
8. **Use MMKV** instead of AsyncStorage for better performance

## Common Tasks

### Adding a New Screen

1. Create the screen file in `app/` or `app/(group)/`
2. Expo Router will automatically handle routing

### Adding a New API Endpoint

1. Create a file in `app/api/` with `+api.ts` suffix
2. Export GET, POST, PUT, DELETE, or PATCH functions
3. Use middleware for authentication and rate limiting

### Adding a New Feature

1. Create a folder in `src/features/`
2. Add components, hooks, services, and schemas
3. Export from the feature's index file

### Adding New Translations

1. Add keys to `src/lib/i18n/locales/*.json`
2. Use `t('key')` to access translations

## Troubleshooting

### Clear Cache

```bash
npx expo start -c
```

### Reset Dependencies

```bash
rm -rf node_modules
npm install
```

### iOS Build Issues

```bash
cd ios && pod install && cd ..
```

## License

MIT

## Support

For issues and questions:
- Check the [Expo documentation](https://docs.expo.dev)
- Visit [Clerk docs](https://clerk.com/docs)
- Read [Supabase docs](https://supabase.com/docs)

---

**Happy coding! 🚀**
