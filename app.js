class TaskFlowPWA {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentView = 'list';
        this.isOnline = navigator.onLine;
        this.lastSync = localStorage.getItem('lastSync') || null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.setupTheme();
        this.setupNetworkListeners();
        this.setupInstallPrompt();
        this.setupKeyboardShortcuts();
        
        // Show last sync info
        if (this.lastSync) {
            document.getElementById('last-sync').textContent = 
                `Last sync: ${new Date(this.lastSync).toLocaleString()}`;
        }
    }

    bindEvents() {
        // Task management
        document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // View toggle
        document.getElementById('list-view-btn').addEventListener('click', () => this.setView('list'));
        document.getElementById('board-view-btn').addEventListener('click', () => this.setView('board'));

        // Header actions
        document.getElementById('sync-btn').addEventListener('click', () => this.syncWithGitHub());
        document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());

        // Modal
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('save-task-btn').addEventListener('click', () => this.saveTaskChanges());
        document.getElementById('delete-task-btn').addEventListener('click', () => this.deleteTaskFromModal());

        // Close modal when clicking outside
        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target.id === 'task-modal') this.closeModal();
        });
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('Back online! Tasks will sync automatically.', 'success');
            this.syncWithGitHub();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('You\'re offline. Tasks will sync when connection returns.', 'warning');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('task-input').focus();
                        break;
                    case 's':
                        e.preventDefault();
                        this.syncWithGitHub();
                        break;
                }
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('theme-btn').innerHTML = '<span class="icon">☀️</span>';
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeBtn = document.getElementById('theme-btn');
        themeBtn.innerHTML = newTheme === 'dark' 
            ? '<span class="icon">☀️</span>' 
            : '<span class="icon">🌙</span>';
        
        this.showToast(`Switched to ${newTheme} theme`, 'success');
    }

    addTask() {
        const input = document.getElementById('task-input');
        const priority = document.getElementById('priority-select').value;
        const text = input.value.trim();

        if (!text) {
            this.showToast('Please enter a task description', 'error');
            return;
        }

        const task = {
            id: Date.now().toString(),
            text,
            priority,
            status: 'todo',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        input.value = '';
        this.showToast('Task added successfully!', 'success');

        // Sync with GitHub if online
        if (this.isOnline) {
            this.syncWithGitHub();
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? 'done' : 'todo';
            task.updatedAt = new Date().toISOString();
            
            this.saveTasks();
            this.renderTasks();
            this.updateStats();

            this.showToast(
                task.completed ? 'Task completed! 🎉' : 'Task marked as pending',
                'success'
            );

            if (this.isOnline) {
                this.syncWithGitHub();
            }
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate modal
        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('modal-task-text').value = task.text;
        document.getElementById('modal-priority').value = task.priority;
        document.getElementById('modal-status').value = task.status;
        
        // Store current task ID for saving
        document.getElementById('task-modal').dataset.taskId = taskId;
        
        // Show modal
        document.getElementById('task-modal').style.display = 'flex';
    }

    saveTaskChanges() {
        const modal = document.getElementById('task-modal');
        const taskId = modal.dataset.taskId;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (!task) return;

        const newText = document.getElementById('modal-task-text').value.trim();
        if (!newText) {
            this.showToast('Task description cannot be empty', 'error');
            return;
        }

        task.text = newText;
        task.priority = document.getElementById('modal-priority').value;
        task.status = document.getElementById('modal-status').value;
        task.completed = task.status === 'done';
        task.updatedAt = new Date().toISOString();

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeModal();
        
        this.showToast('Task updated successfully!', 'success');

        if (this.isOnline) {
            this.syncWithGitHub();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showToast('Task deleted', 'success');

            if (this.isOnline) {
                this.syncWithGitHub();
            }
        }
    }

    deleteTaskFromModal() {
        const taskId = document.getElementById('task-modal').dataset.taskId;
        this.closeModal();
        this.deleteTask(taskId);
    }

    closeModal() {
        document.getElementById('task-modal').style.display = 'none';
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderTasks();
    }

    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.getElementById('list-view-btn').classList.toggle('active', view === 'list');
        document.getElementById('board-view-btn').classList.toggle('active', view === 'board');
        
        // Show/hide views
        document.getElementById('list-view').style.display = view === 'list' ? 'block' : 'none';
        document.getElementById('board-view').style.display = view === 'board' ? 'block' : 'none';
        
        this.renderTasks();
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            switch (this.currentFilter) {
                case 'pending':
                    return !task.completed;
                case 'completed':
                    return task.completed;
                case 'high':
                case 'medium':
                case 'low':
                    return task.priority === this.currentFilter;
                default:
                    return true;
            }
        });
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (this.currentView === 'list') {
            this.renderListView(filteredTasks);
        } else {
            this.renderBoardView(filteredTasks);
        }
    }

    renderListView(tasks) {
        const container = document.getElementById('tasks-list');
        const emptyState = document.getElementById('empty-state');
        
        if (tasks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        container.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
    }

    renderBoardView(tasks) {
        const todoColumn = document.getElementById('todo-column');
        const progressColumn = document.getElementById('progress-column');
        const doneColumn = document.getElementById('done-column');
        
        todoColumn.innerHTML = '';
        progressColumn.innerHTML = '';
        doneColumn.innerHTML = '';
        
        tasks.forEach(task => {
            const taskElement = this.createBoardTaskHTML(task);
            
            switch (task.status) {
                case 'progress':
                    progressColumn.appendChild(taskElement);
                    break;
                case 'done':
                    doneColumn.appendChild(taskElement);
                    break;
                default:
                    todoColumn.appendChild(taskElement);
            }
        });
    }

    createTaskHTML(task) {
        const priorityClass = `priority-${task.priority}`;
        const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="app.toggleTask('${task.id}')"
                >
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="priority-badge ${priorityClass}">
                            ${priorityEmoji} ${task.priority}
                        </span>
                        <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="app.editTask('${task.id}')" title="Edit">
                        ✏️
                    </button>
                    <button class="task-action-btn" onclick="app.deleteTask('${task.id}')" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    createBoardTaskHTML(task) {
        const div = document.createElement('div');
        div.className = 'board-task';
        div.dataset.taskId = task.id;
        
        const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
        
        div.innerHTML = `
            <div class="task-text">${this.escapeHtml(task.text)}</div>
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">
                    ${priorityEmoji} ${task.priority}
                </span>
                <span>${new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        
        div.addEventListener('click', () => this.editTask(task.id));
        
        return div;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        document.getElementById('total-tasks').textContent = total;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('pending-tasks').textContent = pending;
        document.getElementById('productivity-score').textContent = `${productivity}%`;
    }

    async syncWithGitHub() {
        if (!this.isOnline) {
            this.showToast('Cannot sync while offline', 'error');
            return;
        }

        this.showLoading();
        
        try {
            // Simulate GitHub API sync
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.lastSync = new Date().toISOString();
            localStorage.setItem('lastSync', this.lastSync);
            
            document.getElementById('last-sync').textContent = 
                `Last sync: ${new Date(this.lastSync).toLocaleString()}`;
            
            this.showToast('Successfully synced with GitHub!', 'success');
        } catch (error) {
            this.showToast('Sync failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            const installBtn = document.getElementById('install-btn');
            installBtn.style.display = 'block';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        this.showToast('App installed successfully!', 'success');
                        installBtn.style.display = 'none';
                    }
                    
                    deferredPrompt = null;
                }
            });
        });

        window.addEventListener('appinstalled', () => {
            this.showToast('TaskFlow PWA installed!', 'success');
            document.getElementById('install-btn').style.display = 'none';
        });
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow-tasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const app = new TaskFlowPWA();

// Export for global access
window.app = app;
