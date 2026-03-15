/**
 * King Bafété - Admin Panel JavaScript
 * JSON file-based content management via API
 */

(function () {
    'use strict';

    var API_BASE = '/api/data';

    // Cache local des données chargées
    var cache = {
        gallery: [],
        books: [],
        blog: [],
        about: {},
        settings: {}
    };

    // =========================================
    // API Helpers
    // =========================================
    function apiGet(resource) {
        return fetch(API_BASE + '/' + resource)
            .then(function (res) {
                if (!res.ok) throw new Error('Erreur réseau');
                return res.json();
            });
    }

    function apiSave(resource, data) {
        return fetch(API_BASE + '/' + resource, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (res) {
            if (!res.ok) throw new Error('Erreur d\'enregistrement');
            return res.json();
        });
    }

    function getNextId(items) {
        if (!items.length) return 1;
        return Math.max.apply(null, items.map(function (i) { return i.id; })) + 1;
    }

    // =========================================
    // Toast Notifications
    // =========================================
    function showToast(message, type) {
        type = type || 'success';
        var container = document.getElementById('toast-container');
        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;
        toast.innerHTML = '<span class="toast__message">' + escapeHtml(message) + '</span><button class="toast__close">&times;</button>';

        container.appendChild(toast);

        toast.querySelector('.toast__close').addEventListener('click', function () {
            toast.remove();
        });

        setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 4000);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================
    // Authentication
    // =========================================
    function initAuth() {
        var loginForm = document.getElementById('login-form');
        var loginScreen = document.getElementById('login-screen');
        var dashboard = document.getElementById('admin-dashboard');
        var logoutBtn = document.getElementById('logout-btn');

        // Check session
        if (sessionStorage.getItem('kb_auth') === 'true') {
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            initDashboard();
            return;
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var username = document.getElementById('login-user').value;
            var password = document.getElementById('login-pass').value;
            var errorEl = document.getElementById('login-error');

            // Charger les credentials depuis le serveur
            apiGet('settings').then(function (settings) {
                var creds = settings.credentials || { username: 'admin', password: 'kingbafete2026' };

                if (username === creds.username && password === creds.password) {
                    sessionStorage.setItem('kb_auth', 'true');
                    loginScreen.style.display = 'none';
                    dashboard.style.display = 'flex';
                    initDashboard();
                } else {
                    errorEl.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
                }
            }).catch(function () {
                // Fallback si API pas disponible
                if (username === 'admin' && password === 'kingbafete2026') {
                    sessionStorage.setItem('kb_auth', 'true');
                    loginScreen.style.display = 'none';
                    dashboard.style.display = 'flex';
                    initDashboard();
                } else {
                    errorEl.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
                }
            });
        });

        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('kb_auth');
            location.reload();
        });
    }

    // =========================================
    // Sidebar Navigation
    // =========================================
    function initSidebar() {
        var links = document.querySelectorAll('.sidebar__link[data-section]');
        var panels = document.querySelectorAll('.panel');
        var pageTitle = document.getElementById('page-title');
        var toggleBtn = document.getElementById('sidebar-toggle');
        var sidebar = document.getElementById('sidebar');

        var titles = {
            dashboard: 'Tableau de bord',
            gallery: 'Gestion de la Galerie',
            books: 'Gestion des Livres',
            blog: 'Gestion du Blog',
            about: 'Section À Propos',
            settings: 'Paramètres'
        };

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var section = this.dataset.section;

                links.forEach(function (l) { l.classList.remove('active'); });
                this.classList.add('active');

                panels.forEach(function (p) { p.classList.remove('active'); });
                var targetPanel = document.getElementById('panel-' + section);
                if (targetPanel) targetPanel.classList.add('active');

                if (pageTitle) pageTitle.textContent = titles[section] || section;
                if (sidebar) sidebar.classList.remove('open');
            });
        });

        document.querySelectorAll('[data-goto]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var section = this.dataset.goto;
                var link = document.querySelector('.sidebar__link[data-section="' + section + '"]');
                if (link) link.click();
            });
        });

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('open');
            });
        }
    }

    // =========================================
    // Gallery Management
    // =========================================
    function initGalleryAdmin() {
        var modal = document.getElementById('gallery-modal');
        var form = document.getElementById('gallery-form');
        var addBtn = document.getElementById('add-gallery-btn');

        function loadAndRender() {
            apiGet('gallery').then(function (data) {
                cache.gallery = data;
                renderGallery();
            }).catch(function () {
                showToast('Erreur de chargement de la galerie', 'error');
            });
        }

        function renderGallery() {
            var list = document.getElementById('admin-gallery-list');
            if (!list) return;

            var categoryLabels = { evenements: 'Événements', livres: 'Livres', communaute: 'Communauté', medias: 'Médias' };

            list.innerHTML = cache.gallery.map(function (item) {
                return '<div class="admin-gallery-card">' +
                    '<div class="admin-gallery-card__image" style="background: linear-gradient(135deg, ' + escapeHtml(item.color1) + ' 0%, ' + escapeHtml(item.color2) + ' 100%);">' +
                    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>' +
                    '</div>' +
                    '<div class="admin-gallery-card__info">' +
                    '<div class="admin-gallery-card__title">' + escapeHtml(item.caption) + '</div>' +
                    '<div class="admin-gallery-card__meta">' +
                    '<span class="admin-gallery-card__category">' + escapeHtml(categoryLabels[item.category] || item.category) + '</span>' +
                    '<span>' + escapeHtml(item.date) + '</span>' +
                    '</div>' +
                    '<div class="admin-gallery-card__actions">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + item.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + item.id + '">Supprimer</button>' +
                    '</div></div></div>';
            }).join('');

            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editGalleryItem(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteGalleryItem(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(item) {
            document.getElementById('gallery-modal-title').textContent = item ? 'Modifier la photo' : 'Ajouter une photo';
            document.getElementById('gallery-edit-id').value = item ? item.id : '';
            document.getElementById('gallery-caption').value = item ? item.caption : '';
            document.getElementById('gallery-category').value = item ? item.category : 'evenements';
            document.getElementById('gallery-date').value = item ? item.date : '';
            document.getElementById('gallery-color1').value = item ? item.color1 : '#D4722C';
            document.getElementById('gallery-color2').value = item ? item.color2 : '#D4AF37';
            document.getElementById('gallery-size').value = item ? item.size : 'normal';
            modal.classList.add('active');
        }

        function editGalleryItem(id) {
            var item = cache.gallery.find(function (g) { return g.id === id; });
            if (item) openModal(item);
        }

        function deleteGalleryItem(id) {
            if (!confirm('Supprimer cette photo de la galerie ?')) return;
            cache.gallery = cache.gallery.filter(function (g) { return g.id !== id; });
            apiSave('gallery', cache.gallery).then(function () {
                renderGallery();
                showToast('Photo supprimée avec succès');
            }).catch(function () {
                showToast('Erreur lors de la suppression', 'error');
            });
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('gallery-edit-id').value;
            var itemData = {
                caption: document.getElementById('gallery-caption').value,
                category: document.getElementById('gallery-category').value,
                date: document.getElementById('gallery-date').value,
                color1: document.getElementById('gallery-color1').value,
                color2: document.getElementById('gallery-color2').value,
                size: document.getElementById('gallery-size').value
            };

            if (editId) {
                var idx = cache.gallery.findIndex(function (g) { return g.id === parseInt(editId); });
                if (idx !== -1) {
                    cache.gallery[idx] = Object.assign({}, cache.gallery[idx], itemData);
                }
            } else {
                itemData.id = getNextId(cache.gallery);
                cache.gallery.push(itemData);
            }

            apiSave('gallery', cache.gallery).then(function () {
                modal.classList.remove('active');
                renderGallery();
                showToast(editId ? 'Photo modifiée avec succès' : 'Photo ajoutée avec succès');
            }).catch(function () {
                showToast('Erreur lors de l\'enregistrement', 'error');
            });
        });

        setupModalClose(modal);
        loadAndRender();
    }

    // =========================================
    // Books Management
    // =========================================
    function initBooksAdmin() {
        var modal = document.getElementById('book-modal');
        var form = document.getElementById('book-form');
        var addBtn = document.getElementById('add-book-btn');

        function loadAndRender() {
            apiGet('books').then(function (data) {
                cache.books = data;
                renderBooks();
            }).catch(function () {
                showToast('Erreur de chargement des livres', 'error');
            });
        }

        function renderBooks() {
            var list = document.getElementById('admin-books-list');
            if (!list) return;

            list.innerHTML = cache.books.map(function (book) {
                return '<tr>' +
                    '<td><strong>' + escapeHtml(book.title) + '</strong></td>' +
                    '<td>' + escapeHtml(book.description.substring(0, 60)) + '...</td>' +
                    '<td>$' + escapeHtml(book.price) + '</td>' +
                    '<td class="actions-cell">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + book.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + book.id + '">Supprimer</button>' +
                    '</td></tr>';
            }).join('');

            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editBook(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteBook(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(book) {
            document.getElementById('book-modal-title').textContent = book ? 'Modifier le livre' : 'Ajouter un livre';
            document.getElementById('book-edit-id').value = book ? book.id : '';
            document.getElementById('book-title').value = book ? book.title : '';
            document.getElementById('book-description').value = book ? book.description : '';
            document.getElementById('book-price').value = book ? book.price : '';
            document.getElementById('book-link').value = book ? book.link : '';
            modal.classList.add('active');
        }

        function editBook(id) {
            var book = cache.books.find(function (b) { return b.id === id; });
            if (book) openModal(book);
        }

        function deleteBook(id) {
            if (!confirm('Supprimer ce livre ?')) return;
            cache.books = cache.books.filter(function (b) { return b.id !== id; });
            apiSave('books', cache.books).then(function () {
                renderBooks();
                showToast('Livre supprimé avec succès');
            }).catch(function () {
                showToast('Erreur lors de la suppression', 'error');
            });
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('book-edit-id').value;
            var bookData = {
                title: document.getElementById('book-title').value,
                description: document.getElementById('book-description').value,
                price: document.getElementById('book-price').value,
                link: document.getElementById('book-link').value || '#'
            };

            if (editId) {
                var idx = cache.books.findIndex(function (b) { return b.id === parseInt(editId); });
                if (idx !== -1) {
                    cache.books[idx] = Object.assign({}, cache.books[idx], bookData);
                }
            } else {
                bookData.id = getNextId(cache.books);
                cache.books.push(bookData);
            }

            apiSave('books', cache.books).then(function () {
                modal.classList.remove('active');
                renderBooks();
                showToast(editId ? 'Livre modifié avec succès' : 'Livre ajouté avec succès');
            }).catch(function () {
                showToast('Erreur lors de l\'enregistrement', 'error');
            });
        });

        setupModalClose(modal);
        loadAndRender();
    }

    // =========================================
    // Blog Management
    // =========================================
    function initBlogAdmin() {
        var modal = document.getElementById('blog-modal');
        var form = document.getElementById('blog-form');
        var addBtn = document.getElementById('add-blog-btn');

        function loadAndRender() {
            apiGet('blog').then(function (data) {
                cache.blog = data;
                renderBlog();
            }).catch(function () {
                showToast('Erreur de chargement du blog', 'error');
            });
        }

        function renderBlog() {
            var list = document.getElementById('admin-blog-list');
            if (!list) return;

            list.innerHTML = cache.blog.map(function (article) {
                var dateStr = article.date;
                try {
                    var d = new Date(article.date);
                    if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    }
                } catch (e) { /* keep original */ }

                return '<tr>' +
                    '<td><strong>' + escapeHtml(article.title) + '</strong></td>' +
                    '<td>' + escapeHtml(article.category) + '</td>' +
                    '<td>' + escapeHtml(dateStr) + '</td>' +
                    '<td class="actions-cell">' +
                    '<button class="btn-admin btn-admin--edit" data-edit="' + article.id + '">Modifier</button>' +
                    '<button class="btn-admin btn-admin--danger" data-delete="' + article.id + '">Supprimer</button>' +
                    '</td></tr>';
            }).join('');

            list.querySelectorAll('[data-edit]').forEach(function (btn) {
                btn.addEventListener('click', function () { editArticle(parseInt(this.dataset.edit)); });
            });
            list.querySelectorAll('[data-delete]').forEach(function (btn) {
                btn.addEventListener('click', function () { deleteArticle(parseInt(this.dataset.delete)); });
            });

            updateStats();
        }

        function openModal(article) {
            document.getElementById('blog-modal-title').textContent = article ? 'Modifier l\'article' : 'Nouvel article';
            document.getElementById('blog-edit-id').value = article ? article.id : '';
            document.getElementById('blog-title').value = article ? article.title : '';
            document.getElementById('blog-category').value = article ? article.category : 'Culture';
            document.getElementById('blog-excerpt').value = article ? article.excerpt : '';
            document.getElementById('blog-date').value = article ? article.date : new Date().toISOString().split('T')[0];
            modal.classList.add('active');
        }

        function editArticle(id) {
            var article = cache.blog.find(function (a) { return a.id === id; });
            if (article) openModal(article);
        }

        function deleteArticle(id) {
            if (!confirm('Supprimer cet article ?')) return;
            cache.blog = cache.blog.filter(function (a) { return a.id !== id; });
            apiSave('blog', cache.blog).then(function () {
                renderBlog();
                showToast('Article supprimé avec succès');
            }).catch(function () {
                showToast('Erreur lors de la suppression', 'error');
            });
        }

        addBtn.addEventListener('click', function () { openModal(null); });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = document.getElementById('blog-edit-id').value;
            var articleData = {
                title: document.getElementById('blog-title').value,
                category: document.getElementById('blog-category').value,
                excerpt: document.getElementById('blog-excerpt').value,
                date: document.getElementById('blog-date').value
            };

            if (editId) {
                var idx = cache.blog.findIndex(function (a) { return a.id === parseInt(editId); });
                if (idx !== -1) {
                    cache.blog[idx] = Object.assign({}, cache.blog[idx], articleData);
                }
            } else {
                articleData.id = getNextId(cache.blog);
                cache.blog.push(articleData);
            }

            apiSave('blog', cache.blog).then(function () {
                modal.classList.remove('active');
                renderBlog();
                showToast(editId ? 'Article modifié avec succès' : 'Article publié avec succès');
            }).catch(function () {
                showToast('Erreur lors de l\'enregistrement', 'error');
            });
        });

        setupModalClose(modal);
        loadAndRender();
    }

    // =========================================
    // About Management
    // =========================================
    function initAboutAdmin() {
        var saveBtn = document.getElementById('save-about-btn');

        apiGet('about').then(function (about) {
            cache.about = about;
            document.getElementById('about-highlight').value = about.highlight || '';
            document.getElementById('about-text1').value = about.text1 || '';
            document.getElementById('about-text2').value = about.text2 || '';
            document.getElementById('about-text3').value = about.text3 || '';

            if (about.stats && about.stats.length >= 3) {
                document.getElementById('about-stat1-value').value = about.stats[0].value;
                document.getElementById('about-stat1-label').value = about.stats[0].label;
                document.getElementById('about-stat2-value').value = about.stats[1].value;
                document.getElementById('about-stat2-label').value = about.stats[1].label;
                document.getElementById('about-stat3-value').value = about.stats[2].value;
                document.getElementById('about-stat3-label').value = about.stats[2].label;
            }
        }).catch(function () {
            showToast('Erreur de chargement de la section À Propos', 'error');
        });

        saveBtn.addEventListener('click', function () {
            var data = {
                highlight: document.getElementById('about-highlight').value,
                text1: document.getElementById('about-text1').value,
                text2: document.getElementById('about-text2').value,
                text3: document.getElementById('about-text3').value,
                stats: [
                    { value: parseInt(document.getElementById('about-stat1-value').value) || 0, label: document.getElementById('about-stat1-label').value },
                    { value: parseInt(document.getElementById('about-stat2-value').value) || 0, label: document.getElementById('about-stat2-label').value },
                    { value: parseInt(document.getElementById('about-stat3-value').value) || 0, label: document.getElementById('about-stat3-label').value }
                ]
            };

            apiSave('about', data).then(function () {
                showToast('Section À Propos mise à jour');
            }).catch(function () {
                showToast('Erreur lors de l\'enregistrement', 'error');
            });
        });
    }

    // =========================================
    // Settings Management
    // =========================================
    function initSettingsAdmin() {
        var saveBtn = document.getElementById('save-settings-btn');

        apiGet('settings').then(function (settings) {
            cache.settings = settings;
            document.getElementById('setting-title').value = settings.title || '';
            document.getElementById('setting-tagline').value = settings.tagline || '';
            document.getElementById('setting-email').value = settings.email || '';
            document.getElementById('setting-phone').value = settings.phone || '';
            if (settings.credentials) {
                document.getElementById('setting-username').value = settings.credentials.username || 'admin';
            }
        }).catch(function () {
            showToast('Erreur de chargement des paramètres', 'error');
        });

        saveBtn.addEventListener('click', function () {
            var newPassword = document.getElementById('setting-password').value;
            var confirmPassword = document.getElementById('setting-password-confirm').value;

            if (newPassword && newPassword !== confirmPassword) {
                showToast('Les mots de passe ne correspondent pas', 'error');
                return;
            }

            var currentCreds = (cache.settings && cache.settings.credentials) || { username: 'admin', password: 'kingbafete2026' };
            var settingsData = {
                title: document.getElementById('setting-title').value,
                tagline: document.getElementById('setting-tagline').value,
                email: document.getElementById('setting-email').value,
                phone: document.getElementById('setting-phone').value,
                credentials: {
                    username: document.getElementById('setting-username').value,
                    password: newPassword || currentCreds.password
                }
            };

            apiSave('settings', settingsData).then(function () {
                cache.settings = settingsData;
                showToast(newPassword ? 'Paramètres et identifiants mis à jour' : 'Paramètres enregistrés avec succès');
                document.getElementById('setting-password').value = '';
                document.getElementById('setting-password-confirm').value = '';
            }).catch(function () {
                showToast('Erreur lors de l\'enregistrement', 'error');
            });
        });
    }

    // =========================================
    // Update Dashboard Stats
    // =========================================
    function updateStats() {
        var statGallery = document.getElementById('stat-gallery');
        var statBooks = document.getElementById('stat-books');
        var statBlog = document.getElementById('stat-blog');

        if (statGallery) statGallery.textContent = cache.gallery.length;
        if (statBooks) statBooks.textContent = cache.books.length;
        if (statBlog) statBlog.textContent = cache.blog.length;
    }

    // =========================================
    // Modal Close Helper
    // =========================================
    function setupModalClose(modal) {
        var backdrop = modal.querySelector('.modal__backdrop');
        var closeBtn = modal.querySelector('.modal__close');
        var cancelBtn = modal.querySelector('.modal__cancel');

        function close() { modal.classList.remove('active'); }

        if (backdrop) backdrop.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (cancelBtn) cancelBtn.addEventListener('click', close);
    }

    // =========================================
    // Initialize Dashboard
    // =========================================
    function initDashboard() {
        initSidebar();
        initGalleryAdmin();
        initBooksAdmin();
        initBlogAdmin();
        initAboutAdmin();
        initSettingsAdmin();
    }

    // =========================================
    // Initialize
    // =========================================
    function init() {
        initAuth();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
