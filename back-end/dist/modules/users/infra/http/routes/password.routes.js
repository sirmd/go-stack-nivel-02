"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var ForgotPasswordController_1 = __importDefault(require("../controllers/ForgotPasswordController"));
var ResetPasswordController_1 = __importDefault(require("../controllers/ResetPasswordController"));
var passwordRouter = express_1.Router();
var forgotPasswordController = new ForgotPasswordController_1.default();
var resetPasswordController = new ResetPasswordController_1.default();
passwordRouter.post('/forgot', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
    },
}), forgotPasswordController.create);
passwordRouter.post('/reset', celebrate_1.celebrate({
    body: {
        token: celebrate_1.Joi.string().uuid().required(),
        password: celebrate_1.Joi.string().required(),
        old_password: celebrate_1.Joi.string().required().valid(celebrate_1.Joi.ref('password')),
    },
}), resetPasswordController.create);
exports.default = passwordRouter;
