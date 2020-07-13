"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("../../../../config/auth"));
var AppError_1 = __importDefault(require("../../../errors/AppError"));
function ensureAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default('JWT token is missing.', 401);
    }
    // desestruturação
    // 1ª posição é o 'Bearer', não será utilizada
    // 2ª posição é o token
    var _a = authHeader.split(' '), token = _a[1];
    var secret = auth_1.default.jwt.secret;
    try {
        var decoded = jsonwebtoken_1.verify(token, secret);
        var sub = decoded.sub;
        request.user = {
            id: sub,
        };
        return next();
    }
    catch (error) {
        throw new AppError_1.default('Invalid JWT token.', 401);
    }
}
exports.default = ensureAuthenticated;
