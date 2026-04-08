# EcoTrack Dependencies

This file provides a detailed breakdown of all dependencies used in the EcoTrack project, based on `package.json`. Dependencies are grouped by category, with explanations of their purpose and why they're included.

## Runtime Dependencies

These are the core libraries used in production:

### Backend & Data
- **@supabase/supabase-js (^2.101.0)**: JavaScript client for Supabase. Handles authentication (login/logout), database queries, real-time subscriptions, and storage. Essential for user management and data persistence in EcoTrack's carbon tracking features.

### Testing
- **@testing-library/dom (^10.4.1)**: Utilities for testing DOM elements in a browser-like environment. Used for integration tests to ensure UI components interact correctly.
- **@testing-library/jest-dom (^6.9.1)**: Extends Jest with custom matchers for DOM assertions (e.g., checking visibility or attributes). Simplifies writing tests for React components.
- **@testing-library/react (^16.3.2)**: Core library for rendering and testing React components. Allows simulating user interactions and verifying component behavior.
- **@testing-library/user-event (^13.5.0)**: Simulates real user events (e.g., clicks, typing) in tests. Makes tests more realistic by mimicking actual user behavior.

### UI & Animation
- **framer-motion (^12.38.0)**: Animation library for React. Adds smooth transitions, hover effects, and UI animations (e.g., in the landing page or dashboard panels) to enhance user experience.
- **lucide-react (^1.7.0)**: Scalable SVG icon library. Provides icons for the UI (e.g., BarChart3, Leaf in feature highlights).
- **react-icons (^5.6.0)**: Additional icon library with a wide range of icons. Used for buttons, navigation, and other UI elements (e.g., logout icon).

### Core React
- **react (^19.2.4)**: Core library for building UI components and managing state. The foundation of the app's interface.
- **react-dom (^19.2.4)**: React's rendering library for the web. Handles rendering React components into the browser DOM.
- **react-router-dom (^7.13.1)**: Routing library for navigation. Manages page transitions (e.g., from landing to login, or home to emissions page).

### Build & Utils
- **react-scripts (5.0.1)**: Development and build scripts from Create React App. Handles webpack bundling, Babel transpilation, and the dev server.
- **web-vitals (^2.1.4)**: Measures web performance metrics (e.g., loading speed, interactivity). Used in `reportWebVitals.js` to track app performance for optimization.

## Dev Dependencies

These are tools used only during development and building:

### Styling
- **autoprefixer (^10.4.27)**: PostCSS plugin that adds vendor prefixes to CSS for cross-browser compatibility. Works with Tailwind CSS to ensure styles work in older browsers.
- **postcss (^8.5.8)**: CSS processor that applies transformations (e.g., via plugins like Autoprefixer and Tailwind).
- **tailwindcss (^3.4.19)**: Utility-first CSS framework. Provides pre-built classes for rapid styling (e.g., `bg-gradient-to-br`, `text-slate-200`) without custom CSS. Used for the app's dark theme and responsive layouts.

## Summary

- **Total Dependencies**: 13 runtime + 3 dev = 16 packages.
- **Why This Stack?** Optimized for a modern SaaS app: React for UI, Supabase for backend, Tailwind for styling, Framer Motion for polish, and Testing Library for reliability. All dependencies are widely used, well-maintained, and aligned with the app's carbon tracking goals.
- **Installation**: Run `npm install` to install all. Versions are pinned for stability (e.g., `^2.101.0` allows minor updates).
- **Updates**: Check for updates with `npm outdated` and update with `npm update`. Test after updates.

For setup instructions, see [README.md](README.md).