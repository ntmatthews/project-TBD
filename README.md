# TaskFlow PWA 📋✨

A powerful, zero-dependency Progressive Web App for task management that leverages GitHub's ecosystem for enhanced collaboration and tracking.

## 🚀 Features

### ✅ Task Management
- **Add, Edit, Delete Tasks** with priority levels (High, Medium, Low)
- **Multiple Views**: List view and Kanban board view
- **Smart Filtering**: Filter by status, priority, or completion
- **Local Storage**: All data persisted locally with instant sync
- **Real-time Statistics**: Track total, completed, pending tasks and productivity score

### 🎨 User Experience
- **Dark/Light Theme** with system preference detection
- **Responsive Design** optimized for mobile and desktop
- **Keyboard Shortcuts**: Ctrl+K (add task), Ctrl+S (sync)
- **Toast Notifications** for user feedback
- **Offline Support** with service worker caching

### 📱 PWA Features
- **Installable** on mobile and desktop devices
- **App Shortcuts** for quick task actions
- **Offline Functionality** with automatic sync when online
- **Push Notification Ready** (framework in place)
- **Fast Loading** with app shell architecture

### � GitHub Integration
- **GitHub Issues** as collaborative task backlog
- **GitHub Actions** for automated PWA quality checks
- **GitHub Pages** deployment for global access
- **Issue Templates** for tasks, bugs, and feature requests

## 🛠️ Installation & Usage

### Quick Start
1. **Visit the Live App**: [TaskFlow PWA](https://ntmatthews.github.io/project-TBD/)
2. **Install as App**: Click the install button or use browser's install option
3. **Start Adding Tasks**: Use the input field or press Ctrl+K

### Local Development
```bash
# Clone the repository
git clone https://github.com/ntmatthews/project-TBD.git
cd project-TBD

# Serve locally (any static server works)
npx http-server . -p 8080

# OR use VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

### Creating Tasks via GitHub Issues
1. Go to [Issues](https://github.com/ntmatthews/project-TBD/issues)
2. Click "New Issue" and select a template
3. Fill out the task details
4. Tasks automatically sync with the PWA

## 📁 Project Structure

```
TaskFlow PWA/
├── index.html              # Main app shell
├── app.js                 # TaskFlowPWA class with all functionality
├── styles.css             # Responsive CSS with theme support
├── sw.js                  # Service worker for offline support
├── manifest.json          # PWA configuration
├── .github/
│   ├── workflows/         # CI/CD for deployment and quality checks
│   ├── ISSUE_TEMPLATE/    # Templates for tasks, bugs, features
│   ├── lighthouse/        # Lighthouse CI configuration
│   └── copilot-instructions.md
├── icons/                 # PWA icons
└── generate-icons.html    # Icon generator utility
```

## 🔧 Technical Details

### Architecture
- **Zero Dependencies**: Pure HTML, CSS, and JavaScript
- **No Build Process**: Direct deployment and development
- **Modern Web APIs**: Service Workers, Web App Manifest, localStorage
- **Progressive Enhancement**: Works on all modern browsers

### PWA Compliance
- ✅ **Web App Manifest** with required fields and icons
- ✅ **Service Worker** with offline functionality
- ✅ **HTTPS** deployment via GitHub Pages
- ✅ **Responsive Design** for all screen sizes
- ✅ **Lighthouse Score**: 80%+ PWA compliance

### GitHub Actions Workflows
- **PWA Quality Checks**: Validates manifest, tests service worker, runs Lighthouse
- **Deployment**: Automated deployment to GitHub Pages
- **Issue Sync**: Future integration for GitHub Issues ↔ Tasks sync

## 🎯 Usage Guide

### Basic Task Management
1. **Add Task**: Type in the input field and click "Add Task" or press Enter
2. **Set Priority**: Choose High (🔴), Medium (🟡), or Low (🟢) priority
3. **Complete Task**: Check the checkbox to mark as done
4. **Edit Task**: Click the edit button (✏️) to modify details
5. **Delete Task**: Click the delete button (🗑️) to remove

### Views and Filters
- **List View** (📋): Traditional task list with checkboxes
- **Board View** (📊): Kanban-style board with To Do, In Progress, Done columns
- **Filters**: All Tasks, Pending, Completed, or filter by priority level

### Keyboard Shortcuts
- `Ctrl+K` (or `Cmd+K`): Focus on add task input
- `Ctrl+S` (or `Cmd+S`): Sync with GitHub (simulated)
- `Enter`: Add task when input is focused

### Theme Switching
Click the theme button (🌙/☀️) in the header to toggle between light and dark modes.

## 🚀 Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions when code is pushed to the main branch.

### Manual Deployment
```bash
# The app is ready to deploy - no build step required
# Simply serve the files from any static hosting service
```

## 🤝 Contributing

### Reporting Issues
Use the [issue templates](https://github.com/ntmatthews/project-TBD/issues/new/choose):
- **Task Request**: For new features or improvements
- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new functionality

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes (ensure PWA compliance)
4. Test with Lighthouse
5. Submit a pull request

### PWA Quality Standards
- Lighthouse PWA score must be 80% or higher
- All new features must work offline
- Responsive design for mobile and desktop
- Accessibility compliance (WCAG guidelines)

## 📊 GitHub Integration Benefits

### For Individual Use
- **Local Task Management**: Fast, offline-capable task tracking
- **Cross-Device Sync**: Access tasks from any device via GitHub Pages
- **Data Backup**: Tasks can be backed up via GitHub Issues

### For Teams
- **Collaborative Planning**: Use GitHub Issues for public task discussions
- **Project Management**: Track tasks, bugs, and features in one place
- **Automated Quality**: GitHub Actions ensure PWA quality standards

## 🔮 Future Enhancements

- [ ] **Real GitHub Issues Sync**: Bidirectional sync between tasks and issues
- [ ] **Push Notifications**: Reminder notifications for due tasks
- [ ] **Calendar Integration**: Due dates and calendar view
- [ ] **Team Collaboration**: Multi-user task assignment
- [ ] **Analytics Dashboard**: Advanced productivity insights
- [ ] **Import/Export**: Backup and restore functionality

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for providing the platform and ecosystem integration
- **PWA Standards** for enabling native-like web experiences
- **Web Platform APIs** for offline functionality and installability

---

**TaskFlow PWA** - Where productivity meets modern web technology! 🚀✨
