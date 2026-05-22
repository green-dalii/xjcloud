# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-05-22

### Changed
- **Complete frontend redesign**: replaced entire homepage with immersive split-screen video background layout
  - Dual entrance: Traveler ("找一个周末去别人的生活里住几天") + Host ("把你的院子分享给懂的人")
  - Real video backgrounds (hero-farm-life.mp4 + lifestyle-slow-living.mp4) instead of static images
  - Desktop hover expand/collapse effect (flex 1→1.4 / 1→0.7) with 0.7s cubic-bezier transition
  - Mobile responsive: stacked vertical panels, fixed bottom bar
  - Region selector dropdown with five villages
- **New pages**: Explore (/explore) and Host (/host) with video heroes, GSAP ScrollTrigger animations
- **Unified design system — Warm Earth Palette**:
  - Colors: bg-ink (#2d2a26), bg-paper (#f5f1ea), color-moss (#3d5a3f), color-wheat (#c9a96e)
  - Fonts: Noto Serif SC (headings), Cormorant Garamond (display), PingFang SC (UI)
  - CSS custom properties for all tokens in globals.css
- New Navbar component with scroll-aware transparency and backdrop blur
- New Footer component
- Added gsap and tailwindcss-animate dependencies
- Tailwind config extended with shadcn-compatible color tokens, marquee animation

### Removed
- Old homepage implementations (v2 hand-drawn map, v4 static photo backgrounds)
- Old Header and BottomNav components (replaced by Navbar and Footer)
- Tailwind utility CSS for split-panel hover (replaced by LandingPage's inline CSS)

## [0.1.0] - 2026-05-22

### Added
- Next.js 14 project initialization with TypeScript, Tailwind CSS, App Router
- Drizzle ORM schema with 6 tables: users, posts, activities, enrollments, likes, comments
- SQLite database with better-sqlite3 driver
- Seed data with 2 test users
- Responsive navigation: Header (desktop) + BottomNav (mobile)
- NextAuth v5 configuration with Credentials provider and JWT sessions
- Custom auth types for role-based access
- Registration API endpoint with validation
- Login/Register pages with forms
- Profile page with user info API
