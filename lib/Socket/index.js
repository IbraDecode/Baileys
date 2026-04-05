"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Defaults_1 = require("../Defaults");
const registration_1 = require("./registration");
const api_server_1 = require("./api-server");
const makeWASocket = (config) => ((0, registration_1.makeRegistrationSocket)({
    ...Defaults_1.DEFAULT_CONNECTION_CONFIG,
    ...config
}));
exports.default = makeWASocket;
exports.makeWASocket = makeWASocket;
exports.createAPIServer = api_server_1.createAPIServer;
exports.makeAPIServer = api_server_1.makeAPIServer;
