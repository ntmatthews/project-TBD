# Copilot Instructions for TaskFlow PWA

## Project Overview
A zero-dependency Progressive Web App for task management that leverages GitHub's ecosystem including Issues, Actions, Pages, and collaborative features for enhanced productivity tracking.

## Architecture & Core Components

### Application Structure
```
/
├── index.html              # Main application shell with task management UI
├── app.js                 # Core TaskFlowPWA class with full functionality
├── styles.css             # Modern responsive design with CSS variables for theming
├── sw.js                  # Service worker for offline functionality
├── manifest.json          # PWA manifest with shortcuts and advanced features
├── .github/
│   ├── workflows/         # GitHub Actions for deployment and PWA auditing
│   ├── ISSUE_TEMPLATE/    # Task, bug, and feature request templates
│   ├── lighthouse/        # Lighthouse CI configuration
│   └── copilot-instructions.md
├── icons/                 # PWA icons (auto-generated)
└── generate-icons.html    # Icon generator utility
```

### Key Classes & Features
- **TaskFlowPWA Class** (`app.js`): Main application controller with:
  - Local task management with localStorage persistence
  - GitHub sync simulation for collaborative features
  - Theme switching (light/dark mode)
  - Offline/online state management
  - Keyboard shortcuts (Ctrl+K for add task, Ctrl+S for sync)
  - PWA installation handling

### GitHub Integration Strategy
- **GitHub Issues**: Use issue templates for task requests, bugs, and features
- **GitHub Actions**: Automated PWA quality checks and deployment to GitHub Pages
- **GitHub Pages**: Host the PWA for global access
- **Collaborative Tracking**: Issues serve as public task backlog

## Critical Development Workflows

### Local Development
```bash
# Serve with any static server (no build process required)
npx http-server . -p 8080
# OR use VS Code Live Server extension
```

### GitHub Actions Workflows
1. **PWA Quality Checks** (`pwa-audit.yml`): Runs Lighthouse audits, validates manifest, checks service worker
2. **Deployment** (`deploy.yml`): Deploys to GitHub Pages with PWA validation

### Testing PWA Features
1. **Chrome DevTools**: Application > Manifest/Service Workers
2. **Lighthouse**: Automated via GitHub Actions or manual runs
3. **Offline Testing**: Network throttling in DevTools
4. **Installation**: Test `beforeinstallprompt` on various devices

## Project-Specific Conventions

### State Management
- **Tasks**: Stored in localStorage with key `taskflow-tasks`
- **Theme**: Persisted in localStorage with CSS variables
- **Sync Status**: `lastSync` timestamp for GitHub integration status
- **Network State**: Real-time online/offline detection

### Task Data Structure
```javascript
{
  id: string,           // Timestamp-based unique ID
  text: string,         // Task description
  priority: 'high'|'medium'|'low',
  status: 'todo'|'progress'|'done',
  completed: boolean,
  createdAt: ISO string,
  updatedAt: ISO string
}
```

### UI Patterns
- **Dual View System**: List view and Kanban board view
- **Smart Filtering**: By status, priority, and completion state
- **Modal Editing**: Full task editing with validation
- **Toast Notifications**: User feedback for all actions
- **Responsive Design**: Mobile-first with CSS Grid/Flexbox

### PWA Features Implementation
- **Installation Prompts**: `beforeinstallprompt` handling with custom UI
- **Offline Support**: Service worker with cache-first strategy for app shell
- **Theme Integration**: CSS variables with system preference detection
- **Keyboard Shortcuts**: Accessibility and power-user features
- **App Shortcuts**: Manifest shortcuts for quick task actions

## Integration Points & GitHub Ecosystem Usage

### GitHub Issues as Task Backlog
- **Issue Templates**: Pre-configured for tasks, bugs, features
- **Labels**: Automated labeling for priority and type
- **Collaboration**: Public task tracking and discussion

### GitHub Actions for Quality
- **Lighthouse CI**: Automated PWA scoring (minimum 80% PWA score)
- **Manifest Validation**: Ensures PWA compliance
- **Service Worker Checks**: Validates required functionality
- **Deployment**: Automated GitHub Pages deployment

### GitHub Pages Hosting
- **Zero Configuration**: Direct deployment from repository
- **HTTPS**: Required for service worker functionality
- **Global CDN**: Fast worldwide access

## Development Guidelines

### Adding New Features
1. Update `TaskFlowPWA` class methods in `app.js`
2. Add corresponding UI elements in `index.html`
3. Style with CSS variables in `styles.css`
4. Test PWA compliance with Lighthouse
5. Update issue templates if feature affects user workflows

### PWA Compliance Requirements
- **Manifest**: Must include required fields and icons
- **Service Worker**: Must handle install and fetch events
- **HTTPS**: Required for all PWA features
- **Responsive**: Must work on mobile and desktop
- **Lighthouse Score**: Minimum 80% PWA score in CI

### Critical Files for Functionality
- `app.js`: All business logic and PWA features
- `styles.css`: Complete responsive design with theming
- `sw.js`: Offline functionality and caching
- `manifest.json`: PWA configuration and shortcuts
- `.github/workflows/`: Automated quality assurance

### Development Notes
- **Zero Dependencies**: Pure HTML/CSS/JS implementation
- **No Build Process**: Direct deployment and development
- **Offline First**: Service worker handles network failures
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized for mobile and slow networks
