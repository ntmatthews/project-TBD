# Copilot Instructions for GitHub Repo PWA

## Project Overview
A zero-dependency Progressive Web App that provides full GitHub repository functionality including browsing files, viewing commits, managing branches, and handling issues/PRs through the GitHub API.

## Architecture & Core Components

### Application Structure
```
/
├── index.html          # Main application shell
├── app.js             # Core application logic (GitHubPWA class)
├── styles.css         # Complete responsive styling
├── sw.js              # Service worker for offline functionality
├── manifest.json      # PWA manifest configuration
├── icons/             # PWA icons (192x192, 512x512)
└── generate-icons.html # Utility for creating app icons
```

### Key Classes & Patterns
- **GitHubPWA Class** (`app.js`): Main application controller with methods for:
  - GitHub API authentication and requests
  - Repository search, selection, and navigation
  - File browsing with bread crumb navigation
  - Tab-based content switching (files, commits, branches, issues, PRs)
  - Toast notifications and loading states

### GitHub API Integration
- **Authentication**: Uses GitHub Personal Access Tokens stored in localStorage
- **API Endpoints**: All requests go through `apiRequest()` method with proper headers
- **Rate Limiting**: Implements basic error handling for API limits
- **Offline Storage**: Tokens persisted locally; API responses cached by service worker

## Critical Development Workflows

### Local Development
```bash
# Serve with HTTPS (required for service worker)
npx http-server -S -C cert.pem -K key.pem -p 8443
# OR use VS Code Live Server extension with HTTPS
```

### PWA Testing
1. **Chrome DevTools**: Application > Manifest/Service Workers for PWA validation
2. **Lighthouse**: Run PWA audit to ensure compliance
3. **Network Throttling**: Test offline functionality in DevTools
4. **Installation**: Test `beforeinstallprompt` handling on various devices

### Icon Generation
Open `generate-icons.html` in browser to create required PWA icons automatically.

## Project-Specific Conventions

### State Management
- **Repository State**: Stored in `GitHubPWA.currentRepo` object
- **Navigation State**: `currentPath` and `currentBranch` properties track file system position
- **Authentication**: Token stored in localStorage with key `github-token`

### API Request Pattern
```javascript
const response = await this.apiRequest('/repos/owner/repo/contents');
const data = await response.json();
```
All GitHub API calls use the centralized `apiRequest()` method with automatic token injection.

### Tab Navigation System
- Tabs defined in HTML with `data-tab` attributes
- Content loaded dynamically via `switchTab()` method
- Each tab has corresponding `load{TabName}()` method (e.g., `loadCommits()`)

### File System Navigation
- **Breadcrumb Navigation**: Shows current path in repository
- **Directory Traversal**: Uses `navigateToDirectory()` and `navigateUp()` methods
- **File Icons**: Determined by extension via `getFileIcon()` method

## Integration Points & External Dependencies

### GitHub API Endpoints Used
- `/user` - Authentication verification
- `/search/repositories` - Repository search
- `/repos/{owner}/{repo}` - Repository details
- `/repos/{owner}/{repo}/contents/{path}` - File browsing
- `/repos/{owner}/{repo}/commits` - Commit history
- `/repos/{owner}/{repo}/branches` - Branch listing
- `/repos/{owner}/{repo}/issues` - Issues list
- `/repos/{owner}/{repo}/pulls` - Pull requests

### Service Worker Cache Strategy
- **Network First**: For GitHub API requests (fresh data priority)
- **Cache First**: For static assets (app shell, styles, scripts)
- **Cache Fallback**: Returns cached index.html for offline navigation

### Critical Files for Functionality
- `app.js`: Contains all business logic - modify here for new features
- `styles.css`: Responsive design with mobile-first approach
- `sw.js`: Handles offline functionality and caching strategy
- `manifest.json`: PWA configuration including theme colors and icons

### Development Notes
- No build process required - pure HTML/CSS/JS
- All GitHub interactions require valid Personal Access Token
- Responsive design breakpoints at 768px and 480px
- Toast notifications auto-dismiss after 4 seconds
- File content viewer has 600px max height with scroll
