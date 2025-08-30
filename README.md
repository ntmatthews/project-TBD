# GitHub Repository PWA

A zero-dependency Progressive Web App that provides complete GitHub repository functionality through a native-like interface.

## Features

### 🔐 Authentication
- GitHub Personal Access Token authentication
- Secure token storage in localStorage
- User verification and connection status

### 🔍 Repository Management
- Search and browse repositories
- Repository statistics (stars, forks, language)
- Repository selection and navigation

### 📁 File System
- Browse repository files and directories
- Breadcrumb navigation
- File type icons and syntax recognition
- File content viewer with syntax highlighting

### 📝 Repository Information
- **Commits**: View commit history with author and dates
- **Branches**: List all branches with commit references
- **Issues**: Browse open issues with labels and metadata
- **Pull Requests**: View open PRs with branch information

### 💾 Offline Functionality
- Service worker caching for offline access
- Network-first strategy for fresh data
- Offline fallback for navigation

### 📱 PWA Features
- Installable on mobile and desktop
- Responsive design for all screen sizes
- Native app-like experience
- Custom app icons and splash screens

## Getting Started

### Prerequisites
- A GitHub Personal Access Token ([Create one here](https://github.com/settings/tokens))
- Modern web browser with service worker support
- HTTPS server for local development (required for service workers)

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/ntmatthews/project-TBD.git
   cd project-TBD
   ```

2. **Serve with HTTPS**
   ```bash
   # Option 1: Using npx http-server
   npx http-server -S -C cert.pem -K key.pem -p 8443
   
   # Option 2: Using VS Code Live Server extension
   # Right-click index.html -> "Open with Live Server"
   ```

3. **Access the Application**
   - Open `https://localhost:8443` in your browser
   - Accept the self-signed certificate warning for local development

### Usage

1. **Connect to GitHub**
   - Enter your GitHub Personal Access Token
   - Click "Connect" to authenticate

2. **Search Repositories**
   - Type repository names or keywords in the search box
   - Click on any repository to open it

3. **Browse Repository**
   - Use the tabs to navigate between Files, Commits, Branches, Issues, and Pull Requests
   - Click on directories to navigate deeper
   - Click on files to view their content

4. **Install as App** (Optional)
   - Click the "Install App" button when it appears
   - Or use browser's install option (usually in the address bar)

## Architecture

### File Structure
```
/
├── index.html          # Main application shell
├── app.js             # Core application logic
├── styles.css         # Responsive styling
├── sw.js              # Service worker
├── manifest.json      # PWA manifest
├── icons/             # App icons
└── generate-icons.html # Icon generator utility
```

### Key Components

- **GitHubPWA Class**: Main application controller
- **Service Worker**: Handles caching and offline functionality
- **GitHub API Integration**: Full REST API implementation
- **Responsive UI**: Mobile-first design with progressive enhancement

## Browser Support

- Chrome/Chromium 67+
- Firefox 62+
- Safari 11.1+
- Edge 79+

## Security

- Tokens are stored locally and never transmitted to third parties
- All GitHub API calls use HTTPS
- Service worker only caches public content
- No external dependencies or analytics

## Development

### Creating Icons
Open `generate-icons.html` in your browser to automatically generate the required PWA icons.

### Testing PWA Features
1. Use Chrome DevTools > Application tab
2. Test service worker functionality
3. Validate manifest.json
4. Run Lighthouse PWA audit

### API Rate Limits
GitHub API has rate limits:
- 60 requests/hour for unauthenticated requests
- 5,000 requests/hour with authentication token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially offline functionality)
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- GitHub API for providing comprehensive repository access
- Progressive Web App standards for offline-first architecture
- Modern browser APIs for native-like functionality
