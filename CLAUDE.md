# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application for generating commercial proposals for construction projects. It's built with Vite and focuses on creating professional construction quotes with mobile/desktop responsiveness and PDF generation capabilities.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture and Key Components

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **PDF Generation**: @react-pdf/renderer
- **Charts**: Chart.js + react-chartjs-2

### Project Structure
```
src/
├── App.tsx                 # Main app with mobile/desktop mode toggle
├── main.tsx               # App entry point
├── index.css              # Global styles
├── vite-env.d.ts          # Vite type declarations
└── components/
    ├── Header.tsx         # Header with company branding and PDF download
    ├── NavigationSidebar.tsx  # Section navigation
    ├── ProjectSummary.tsx     # Project overview and characteristics
    ├── PricingBreakdown.tsx   # Detailed pricing tables
    ├── PricingTable.tsx       # Reusable pricing table component
    ├── Services.tsx           # Services included section
    ├── TotalSummary.tsx       # Financial summary with charts
    ├── Exclusions.tsx         # Non-included services and exclusions
    ├── Timeline.tsx           # Project timeline and phases
    ├── PdfDocument.tsx        # PDF export component
    └── Footer.tsx             # Footer with contact info
```

### Key Features
1. **Responsive Design**: Mobile-first with desktop mode toggle for small screens
2. **PDF Generation**: Complete PDF export of the commercial proposal using @react-pdf/renderer
3. **Dynamic Pricing**: Component-based pricing breakdown with automatic calculations
4. **Professional Layout**: Construction industry-focused design with company branding
5. **Navigation**: Sidebar navigation for easy section jumping

### Mobile/Desktop Mode System
The app includes a sophisticated mobile/desktop toggle system:
- Detects real mobile devices (not just viewport size)
- Forces desktop layout on mobile when toggled
- Adjusts viewport meta tag dynamically
- Uses CSS overrides to apply lg: breakpoint styles on mobile

### Data Architecture
- Pricing data and project information are embedded in components
- PDF document component mirrors the web UI data structure
- Color scheme uses consistent brand colors (#c1a16a for primary, #787346 for secondary)

## Development Guidelines

### Styling Conventions
- Uses Tailwind CSS with responsive prefixes (sm:, md:, lg:)
- Brand colors: #c1a16a (gold) and #787346 (dark gold)
- Component-based styling with conditional classes for mobile/desktop modes

### Component Patterns
- Functional components with TypeScript interfaces
- Props interfaces defined for reusable components
- Responsive design through conditional rendering and classes
- PDF components mirror web UI components for consistency

### State Management
- Uses React hooks for local state (useState, useEffect)
- No external state management library
- Mobile detection and mode toggle handled in App.tsx

## Deployment

The project is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing configured in netlify.toml

## Important Notes

- PDF generation requires all data to be embedded in PdfDocument.tsx
- Mobile mode toggle is only visible on actual mobile devices (screen width < 768px)
- The project uses French language content for a construction company (PROGINEER)
- Static assets (images, logos) are served from the public directory

## File Naming Conventions
- Components use PascalCase (Header.tsx, PricingTable.tsx)
- Configuration files use standard naming (package.json, vite.config.ts)
- CSS follows standard conventions (index.css)