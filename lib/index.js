"use strict";

const chalk = require("chalk");

console.log(chalk.red.bold("\n[+] SOCKETON v1.6.0\n"));
console.log(chalk.whiteBright("[!] Developer: Ibra Decode"));
console.log(chalk.gray("--------------------"));
const latestUpdate = new Date("2026-01-28");
console.log(chalk.gray("need help? 6285792820173"));
console.log(chalk.yellowBright("[*] Updated: ") + chalk.whiteBright(latestUpdate.toLocaleDateString()));
console.log(chalk.gray("--------------------\n"));
console.log(chalk.greenBright("[+] WhatsApp API Ready\n"));
// 01001001 01101110 01110100 01100101 01110010 01100001 01100011 01110100 01101001 01110110 01100101 00100000 01000010 01101001 01101110 01100001 01110010 01111001 00100000 01000101 01100110 01100110 01100101 01100011 01110100

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWASocket = void 0;
const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;
__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;
