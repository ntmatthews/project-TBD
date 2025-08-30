class GitHubPWA {
    constructor() {
        this.token = localStorage.getItem('github-token') || '';
        this.currentRepo = null;
        this.currentPath = '';
        this.currentBranch = 'main';
        this.apiBase = 'https://api.github.com';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialState();
    }

    bindEvents() {
        // Authentication
        document.getElementById('connect-btn').addEventListener('click', () => this.connect());
        document.getElementById('disconnect-btn').addEventListener('click', () => this.disconnect());
        
        // Repository search
        document.getElementById('repo-search').addEventListener('input', this.debounce((e) => {
            this.searchRepositories(e.target.value);
        }, 300));
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Repository actions
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshRepository());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadRepository());
        document.getElementById('close-file').addEventListener('click', () => this.closeFileViewer());
        
        // Install prompt
        this.handleInstallPrompt();
    }

    loadInitialState() {
        if (this.token) {
            document.getElementById('token-input').value = this.token;
            document.getElementById('connect-btn').style.display = 'none';
            document.getElementById('disconnect-btn').style.display = 'inline-block';
            this.showRepositorySearch();
        }
    }

    async connect() {
        const token = document.getElementById('token-input').value.trim();
        if (!token) {
            this.showToast('Please enter a GitHub token', 'error');
            return;
        }

        this.showLoading();
        try {
            // Verify token by getting user info
            const response = await this.apiRequest('/user', token);
            if (response.ok) {
                const user = await response.json();
                this.token = token;
                localStorage.setItem('github-token', token);
                
                document.getElementById('connect-btn').style.display = 'none';
                document.getElementById('disconnect-btn').style.display = 'inline-block';
                
                this.showToast(`Connected as ${user.login}`, 'success');
                this.showRepositorySearch();
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            this.showToast('Invalid GitHub token', 'error');
        } finally {
            this.hideLoading();
        }
    }

    disconnect() {
        this.token = '';
        localStorage.removeItem('github-token');
        document.getElementById('token-input').value = '';
        document.getElementById('connect-btn').style.display = 'inline-block';
        document.getElementById('disconnect-btn').style.display = 'none';
        
        document.getElementById('repo-selection').style.display = 'block';
        document.getElementById('repo-content').style.display = 'none';
        document.getElementById('repo-results').innerHTML = '';
        
        this.showToast('Disconnected from GitHub', 'success');
    }

    showRepositorySearch() {
        document.getElementById('repo-selection').style.display = 'block';
        document.getElementById('repo-content').style.display = 'none';
    }

    async searchRepositories(query) {
        if (!query.trim() || !this.token) return;
        
        try {
            const response = await this.apiRequest(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`);
            const data = await response.json();
            
            this.displayRepositoryResults(data.items || []);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displayRepositoryResults(repos) {
        const container = document.getElementById('repo-results');
        
        if (repos.length === 0) {
            container.innerHTML = '<p>No repositories found</p>';
            return;
        }
        
        container.innerHTML = repos.map(repo => `
            <div class="repo-item" onclick="app.selectRepository('${repo.full_name}')">
                <div class="repo-item-name">${repo.full_name}</div>
                <div class="repo-item-description">${repo.description || 'No description'}</div>
                <div class="repo-item-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>📝 ${repo.language || 'Unknown'}</span>
                </div>
            </div>
        `).join('');
    }

    async selectRepository(fullName) {
        this.showLoading();
        try {
            const response = await this.apiRequest(`/repos/${fullName}`);
            const repo = await response.json();
            
            this.currentRepo = repo;
            this.currentPath = '';
            this.currentBranch = repo.default_branch || 'main';
            
            this.displayRepository(repo);
            this.loadRepositoryFiles();
            
            document.getElementById('repo-selection').style.display = 'none';
            document.getElementById('repo-content').style.display = 'block';
        } catch (error) {
            this.showToast('Error loading repository', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayRepository(repo) {
        document.getElementById('repo-name').textContent = repo.full_name;
        document.getElementById('repo-description').textContent = repo.description || 'No description';
        document.getElementById('stars-count').textContent = `⭐ ${repo.stargazers_count}`;
        document.getElementById('forks-count').textContent = `🍴 ${repo.forks_count}`;
        document.getElementById('language').textContent = `📝 ${repo.language || 'Unknown'}`;
    }

    async loadRepositoryFiles() {
        try {
            const path = this.currentPath ? `/${this.currentPath}` : '';
            const response = await this.apiRequest(`/repos/${this.currentRepo.full_name}/contents${path}?ref=${this.currentBranch}`);
            const contents = await response.json();
            
            this.displayFileTree(Array.isArray(contents) ? contents : [contents]);
            document.getElementById('current-path').textContent = `/${this.currentPath}`;
        } catch (error) {
            this.showToast('Error loading files', 'error');
        }
    }

    displayFileTree(contents) {
        const container = document.getElementById('file-tree');
        
        let html = '';
        
        // Add back button if not in root
        if (this.currentPath) {
            html += `
                <div class="file-item" onclick="app.navigateUp()">
                    <span class="file-icon">📁</span>
                    <span class="file-name">..</span>
                </div>
            `;
        }
        
        // Sort directories first, then files
        const sorted = contents.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'dir' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        html += sorted.map(item => {
            const icon = item.type === 'dir' ? '📁' : this.getFileIcon(item.name);
            const action = item.type === 'dir' 
                ? `app.navigateToDirectory('${item.name}')`
                : `app.openFile('${item.name}', '${item.download_url}')`;
            
            return `
                <div class="file-item" onclick="${action}">
                    <span class="file-icon">${icon}</span>
                    <span class="file-name">${item.name}</span>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'js': '📄', 'ts': '📄', 'jsx': '📄', 'tsx': '📄',
            'html': '🌐', 'css': '🎨', 'scss': '🎨', 'sass': '🎨',
            'json': '📋', 'xml': '📋', 'yaml': '📋', 'yml': '📋',
            'md': '📝', 'txt': '📝', 'readme': '📝',
            'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️', 'svg': '🖼️',
            'pdf': '📕', 'doc': '📄', 'docx': '📄',
            'zip': '📦', 'tar': '📦', 'gz': '📦',
            'py': '🐍', 'java': '☕', 'cpp': '⚙️', 'c': '⚙️',
            'php': '🐘', 'rb': '💎', 'go': '🐹', 'rs': '⚙️'
        };
        return icons[ext] || '📄';
    }

    navigateToDirectory(dirname) {
        this.currentPath = this.currentPath ? `${this.currentPath}/${dirname}` : dirname;
        this.loadRepositoryFiles();
    }

    navigateUp() {
        const parts = this.currentPath.split('/');
        parts.pop();
        this.currentPath = parts.join('/');
        this.loadRepositoryFiles();
    }

    async openFile(filename, downloadUrl) {
        if (!downloadUrl) return;
        
        this.showLoading();
        try {
            const response = await fetch(downloadUrl);
            const content = await response.text();
            
            document.getElementById('file-name').textContent = filename;
            document.getElementById('file-content').textContent = content;
            document.getElementById('file-viewer').style.display = 'block';
        } catch (error) {
            this.showToast('Error loading file', 'error');
        } finally {
            this.hideLoading();
        }
    }

    closeFileViewer() {
        document.getElementById('file-viewer').style.display = 'none';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab content
        switch (tabName) {
            case 'commits':
                this.loadCommits();
                break;
            case 'branches':
                this.loadBranches();
                break;
            case 'issues':
                this.loadIssues();
                break;
            case 'pulls':
                this.loadPullRequests();
                break;
        }
    }

    async loadCommits() {
        if (!this.currentRepo) return;
        
        try {
            const response = await this.apiRequest(`/repos/${this.currentRepo.full_name}/commits?per_page=20`);
            const commits = await response.json();
            
            const container = document.getElementById('commits-list');
            container.innerHTML = commits.map(commit => `
                <div class="list-item">
                    <div class="list-item-title">${commit.commit.message.split('\n')[0]}</div>
                    <div class="list-item-meta">
                        <span class="commit-hash">${commit.sha.substring(0, 7)}</span>
                        by ${commit.commit.author.name} on ${new Date(commit.commit.author.date).toLocaleDateString()}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            this.showToast('Error loading commits', 'error');
        }
    }

    async loadBranches() {
        if (!this.currentRepo) return;
        
        try {
            const response = await this.apiRequest(`/repos/${this.currentRepo.full_name}/branches`);
            const branches = await response.json();
            
            const container = document.getElementById('branches-list');
            container.innerHTML = branches.map(branch => `
                <div class="list-item">
                    <div class="list-item-title">${branch.name}</div>
                    <div class="list-item-meta">
                        <span class="commit-hash">${branch.commit.sha.substring(0, 7)}</span>
                        ${branch.name === this.currentBranch ? '(current)' : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            this.showToast('Error loading branches', 'error');
        }
    }

    async loadIssues() {
        if (!this.currentRepo) return;
        
        try {
            const response = await this.apiRequest(`/repos/${this.currentRepo.full_name}/issues?state=open&per_page=20`);
            const issues = await response.json();
            
            const container = document.getElementById('issues-list');
            if (issues.length === 0) {
                container.innerHTML = '<div class="list-item">No open issues</div>';
                return;
            }
            
            container.innerHTML = issues.map(issue => `
                <div class="list-item">
                    <div class="list-item-title">#${issue.number} ${issue.title}</div>
                    <div class="list-item-meta">
                        by ${issue.user.login} on ${new Date(issue.created_at).toLocaleDateString()}
                        ${issue.labels.map(label => `<span style="background: #${label.color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-left: 4px;">${label.name}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            this.showToast('Error loading issues', 'error');
        }
    }

    async loadPullRequests() {
        if (!this.currentRepo) return;
        
        try {
            const response = await this.apiRequest(`/repos/${this.currentRepo.full_name}/pulls?state=open&per_page=20`);
            const pulls = await response.json();
            
            const container = document.getElementById('pulls-list');
            if (pulls.length === 0) {
                container.innerHTML = '<div class="list-item">No open pull requests</div>';
                return;
            }
            
            container.innerHTML = pulls.map(pr => `
                <div class="list-item">
                    <div class="list-item-title">#${pr.number} ${pr.title}</div>
                    <div class="list-item-meta">
                        by ${pr.user.login} on ${new Date(pr.created_at).toLocaleDateString()}
                        • ${pr.head.ref} → ${pr.base.ref}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            this.showToast('Error loading pull requests', 'error');
        }
    }

    async refreshRepository() {
        if (!this.currentRepo) return;
        
        this.showToast('Refreshing repository...', 'success');
        await this.selectRepository(this.currentRepo.full_name);
    }

    async downloadRepository() {
        if (!this.currentRepo) return;
        
        const url = `https://github.com/${this.currentRepo.full_name}/archive/refs/heads/${this.currentBranch}.zip`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentRepo.name}-${this.currentBranch}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Download started', 'success');
    }

    async apiRequest(endpoint, token = this.token) {
        const headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        };
        
        return fetch(`${this.apiBase}${endpoint}`, { headers });
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

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.createElement('button');
            installBtn.textContent = '📱 Install App';
            installBtn.className = 'btn btn-primary';
            installBtn.style.marginLeft = '8px';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        this.showToast('App installed successfully!', 'success');
                    }
                    
                    deferredPrompt = null;
                    installBtn.remove();
                }
            });
            
            document.querySelector('.repo-actions').appendChild(installBtn);
        });
    }
}

// Initialize the application
const app = new GitHubPWA();
