"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwt: {
        secret: process.env.APP_SECRET || 'segredo',
        expiresIn: '1d',
    },
};
