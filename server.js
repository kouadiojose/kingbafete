/**
 * King Bafété - Serveur Node.js
 * Sert les fichiers statiques et fournit une API pour lire/écrire les fichiers JSON
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Types MIME pour les fichiers statiques
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Fichiers JSON autorisés (sécurité)
const ALLOWED_FILES = ['gallery', 'books', 'blog', 'about', 'settings'];

/**
 * Lire un fichier JSON
 */
function readJsonFile(name) {
    const filePath = path.join(DATA_DIR, name + '.json');
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        return null;
    }
}

/**
 * Écrire un fichier JSON
 */
function writeJsonFile(name, data) {
    const filePath = path.join(DATA_DIR, name + '.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
}

/**
 * Lire le body d'une requête POST
 */
function readBody(req) {
    return new Promise(function (resolve, reject) {
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
            // Limiter à 1 Mo
            if (body.length > 1048576) {
                reject(new Error('Body too large'));
            }
        });
        req.on('end', function () {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

/**
 * Envoyer une réponse JSON
 */
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

/**
 * Servir un fichier statique
 */
function serveStatic(req, res) {
    var urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';

    // Sécurité : empêcher le directory traversal
    var filePath = path.join(__dirname, path.normalize(urlPath));
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    var ext = path.extname(filePath).toLowerCase();
    var contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, function (err, content) {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Fichier non trouvé');
            } else {
                res.writeHead(500);
                res.end('Erreur serveur');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}

/**
 * Serveur principal
 */
const server = http.createServer(function (req, res) {
    var method = req.method;
    var urlPath = req.url.split('?')[0];

    // CORS pour les requêtes preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // API Routes : /api/data/{name}
    var apiMatch = urlPath.match(/^\/api\/data\/(\w+)$/);
    if (apiMatch) {
        var fileName = apiMatch[1];

        // Vérifier que le fichier est autorisé
        if (ALLOWED_FILES.indexOf(fileName) === -1) {
            sendJson(res, 404, { error: 'Ressource non trouvée' });
            return;
        }

        // GET - Lire les données
        if (method === 'GET') {
            var data = readJsonFile(fileName);
            if (data === null) {
                sendJson(res, 404, { error: 'Fichier non trouvé' });
            } else {
                sendJson(res, 200, data);
            }
            return;
        }

        // POST/PUT - Écrire les données
        if (method === 'POST' || method === 'PUT') {
            readBody(req).then(function (body) {
                writeJsonFile(fileName, body);
                sendJson(res, 200, { success: true, message: 'Données enregistrées' });
            }).catch(function (err) {
                sendJson(res, 400, { error: err.message });
            });
            return;
        }

        sendJson(res, 405, { error: 'Méthode non autorisée' });
        return;
    }

    // Fichiers statiques
    serveStatic(req, res);
});

// S'assurer que le dossier data existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

var HOST = '0.0.0.0';
server.listen(PORT, HOST, function () {
    console.log('');
    console.log('  King Bafété - Serveur Web');
    console.log('  Port: ' + PORT);
    console.log('  Site:  http://localhost:' + PORT);
    console.log('  Admin: http://localhost:' + PORT + '/admin.html');
    console.log('  API:   /api/data/{gallery|books|blog|about|settings}');
    console.log('');
});
