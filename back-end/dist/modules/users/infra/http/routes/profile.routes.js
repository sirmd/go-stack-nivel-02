"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var celebrate_1 = require("celebrate");
var ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
var profileRouter = express_1.Router();
var profileController = new ProfileController_1.default();
profileRouter.use(ensureAuthenticated_1.default);
profileRouter.put('/', celebrate_1.celebrate({
    body: celebrate_1.Joi.object()
        .keys({
        nome: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().optional(),
        old_password: celebrate_1.Joi.string().optional().valid(celebrate_1.Joi.ref('password')),
    })
        .with('password', 'old_password'),
}), profileController.create);
profileRouter.get('/', profileController.show);
exports.default = profileRouter;
