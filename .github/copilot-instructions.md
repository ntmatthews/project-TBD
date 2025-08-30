# Copilot Instructions for PWA Project

## Project Overview
This is a Progressive Web App (PWA) project designed to provide native-like experience across web and mobile platforms.

## Architecture & Structure
*Note: This section will be updated as the project structure develops*

### Core Components
- **Service Worker**: Handles offline functionality, caching strategies, and background sync
- **Web App Manifest**: Defines app metadata, icons, and installation behavior
- **Application Shell**: Core UI structure that loads quickly and caches effectively

### Development Patterns
When implementing PWA features:
- Always consider offline-first design patterns
- Implement proper cache invalidation strategies in service worker
- Use responsive design principles for cross-device compatibility
- Follow accessibility best practices for inclusive user experience

## Key Development Workflows

### PWA-Specific Implementation
- **Service Worker Registration**: Place in root directory, register early in app lifecycle
- **Cache Strategy**: Use cache-first for static assets, network-first for dynamic content
- **Manifest Setup**: Ensure proper icon sizes (192x192, 512x512) and theme colors
- **Installation Prompts**: Implement beforeinstallprompt event handling

### Testing & Validation
- Use Chrome DevTools Application tab for PWA auditing
- Test offline functionality across different network conditions
- Validate manifest.json using web app manifest validators
- Test installation flow on multiple devices/browsers

## File Organization Conventions
*To be updated as project structure is established*

### Recommended Structure
```
/
├── public/
│   ├── manifest.json
│   ├── sw.js (service worker)
│   └── icons/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── styles/
└── tests/
```

## Dependencies & Integration
*To be documented as dependencies are added*

### PWA Essentials
- Service worker implementation (native or library-based)
- Web app manifest configuration
- Responsive CSS framework or custom responsive design
- Offline storage solution (IndexedDB, localStorage, etc.)

## Development Commands
*To be updated with actual build/test commands*

Common PWA development tasks:
- Build and serve for development with HTTPS (required for service workers)
- Generate service worker with proper caching strategies
- Validate PWA compliance with Lighthouse
- Test offline functionality

---

*This file will be updated as the project evolves. Please update sections with actual implementation details as they are established.*
