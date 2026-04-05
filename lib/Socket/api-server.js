"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAPIServer = exports.createAPIServer = void 0;
const http = require('http');
const crypto = require('crypto');
const axios = require('axios');

const VALID_USERS = {
    'ibradecode': '088103'
};

let _apiKeys = new Map();

const generateAPIKey = () => {
    const randomPart = crypto.randomBytes(12).toString('hex');
    return `socketon_${randomPart}`;
};

const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
};

const authenticate = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }
    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        if (VALID_USERS[username] && VALID_USERS[username] === password) {
            return { username, valid: true };
        }
    } catch (err) {}
    return null;
};

const validateAPIKey = (apiKey) => {
    if (!apiKey) return null;
    const user = _apiKeys.get(apiKey);
    return user || null;
};

const makeAPIServer = () => {
    const handlers = {};

    handlers.createAPIKey = async (body, auth) => {
        if (!auth) {
            return { status: 401, data: { error: 'Unauthorized - Invalid credentials' } };
        }
        
        const apiKey = generateAPIKey();
        _apiKeys.set(apiKey, {
            username: auth.username,
            createdAt: Date.now()
        });
        
        return { 
            status: 201, 
            data: {
                success: true,
                apiKey: apiKey,
                username: auth.username,
                message: 'API Key created successfully'
            }
        };
    };

    handlers.deleteAPIKey = async (body, auth) => {
        if (!auth) {
            return { status: 401, data: { error: 'Unauthorized - Invalid credentials' } };
        }
        
        const apiKey = body.apiKey;
        if (!apiKey) {
            return { status: 400, data: { error: 'API Key is required' } };
        }
        
        if (_apiKeys.has(apiKey)) {
            _apiKeys.delete(apiKey);
            return { status: 200, data: { success: true, message: 'API Key deleted' } };
        }
        return { status: 404, data: { error: 'API Key not found' } };
    };

    handlers.listAPIKeys = async (body, auth) => {
        if (!auth) {
            return { status: 401, data: { error: 'Unauthorized - Invalid credentials' } };
        }
        
        const keys = [];
        for (const [key, value] of _apiKeys.entries()) {
            if (value.username === auth.username) {
                keys.push({
                    apiKey: key,
                    createdAt: new Date(value.createdAt).toISOString()
                });
            }
        }
        
        return { status: 200, data: { keys } };
    };

    handlers.stickerQuery = async (body, apiKey) => {
        if (!apiKey) {
            return { status: 401, data: { error: 'Invalid or missing API Key' } };
        }
        
        const { query } = body;
        if (!query) {
            return { status: 400, data: { error: 'Query is required' } };
        }
        
        const queries = query.split(',').map(q => q.trim()).filter(q => q);
        if (queries.length === 0) {
            return { status: 400, data: { error: 'No valid queries provided' } };
        }
        
        const results = [];
        for (const q of queries) {
            try {
                const response = await axios.get(`https://api.dhikaaa.me/search/sticker?q=${encodeURIComponent(q)}`, {
                    timeout: 10000
                });
                results.push({
                    query: q,
                    status: 'success',
                    data: response.data.results || []
                });
            } catch (err) {
                results.push({
                    query: q,
                    status: 'error',
                    error: err.message
                });
            }
        }
        
        return { status: 200, data: { results } };
    };

    handlers.newsletterMetadata = async (body, apiKey) => {
        if (!apiKey) {
            return { status: 401, data: { error: 'Invalid or missing API Key' } };
        }
        
        const { urlCh } = body;
        if (!urlCh) {
            return { status: 400, data: { error: 'urlCh is required' } };
        }
        
        const channelRegex = /whatsapp\.com\/channel\/([A-Za-z0-9_-]+)(?:\/(\d+))?/;
        const match = urlCh.match(channelRegex);
        
        if (!match) {
            return { status: 400, data: { error: 'Invalid channel URL format' } };
        }
        
        const inviteCode = match[1];
        const serverId = match[2] || null;
        
        try {
            const response = await axios.get(`https://api.dhikaaa.me/newsletter/metadata/${inviteCode}`, {
                timeout: 10000
            });
            
            return {
                status: 200,
                data: {
                    success: true,
                    inviteCode: inviteCode,
                    serverId: serverId,
                    data: response.data
                }
            };
        } catch (err) {
            return {
                status: 500,
                data: {
                    success: false,
                    error: err.message,
                    inviteCode: inviteCode,
                    serverId: serverId
                }
            };
        }
    };

    handlers.checkAPIKey = async (body, apiKey) => {
        if (!apiKey) {
            return { status: 401, data: { valid: false, error: 'Invalid API Key' } };
        }
        
        return { status: 200, data: { valid: true, username: apiKey.username } };
    };

    return handlers;
};

const createAPIServer = (port = 3000) => {
    const handlers = makeAPIServer();
    
    const server = http.createServer(async (req, res) => {
        const url = req.url.split('?')[0];
        const method = req.method;
        const authHeader = req.headers.authorization;
        const apiKey = req.headers['x-api-key'] || (new URL(req.url, `http://localhost`).searchParams.get('apiKey'));
        
        const auth = authenticate(authHeader);
        const keyData = validateAPIKey(apiKey);
        
        const body = await parseBody(req);
        
        let result = { status: 404, data: { error: 'Not Found' } };
        
        if (method === 'POST' && url === '/api/key/create') {
            result = await handlers.createAPIKey(body, auth);
        } else if (method === 'DELETE' && url === '/api/key/delete') {
            result = await handlers.deleteAPIKey(body, auth);
        } else if (method === 'GET' && url === '/api/key/list') {
            result = await handlers.listAPIKeys(body, auth);
        } else if (method === 'POST' && url === '/api/sticker/query') {
            result = await handlers.stickerQuery(body, keyData);
        } else if (method === 'POST' && url === '/api/newsletter/metadata') {
            result = await handlers.newsletterMetadata(body, keyData);
        } else if (method === 'GET' && url === '/api/key/check') {
            result = await handlers.checkAPIKey(body, keyData);
        }
        
        sendJSON(res, result.status, result.data);
    });
    
    server.listen(port, () => {
        console.log(`[API Server] Running on port ${port}`);
    });
    
    return { server, handlers };
};

exports.makeAPIServer = makeAPIServer;
exports.createAPIServer = createAPIServer;