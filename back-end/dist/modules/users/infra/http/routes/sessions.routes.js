"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var SessionsControllers_1 = __importDefault(require("../controllers/SessionsControllers"));
var sessionsRouter = express_1.Router();
var sessionsController = new SessionsControllers_1.default();
sessionsRouter.post('/', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
}), sessionsController.create);
exports.default = sessionsRouter;
