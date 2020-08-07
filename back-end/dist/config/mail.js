"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    driver: process.env.MAIL_DRIVER || 'ethereal',
    defaults: {
        from: {
            email: 'contato@bemestar4you.com',
            name: 'Mateus Deitos',
        },
    },
};
