"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var celebrate_1 = require("celebrate");
var ProvidersController_1 = __importDefault(require("../controllers/ProvidersController"));
var ProviderDayAvailabilityController_1 = __importDefault(require("../controllers/ProviderDayAvailabilityController"));
var ProviderMonthAvailabilityController_1 = __importDefault(require("../controllers/ProviderMonthAvailabilityController"));
var providersRouter = express_1.Router();
var providersController = new ProvidersController_1.default();
var providersDayAvailabilityController = new ProviderDayAvailabilityController_1.default();
var providersMonthAvailabilityController = new ProviderMonthAvailabilityController_1.default();
providersRouter.use(ensureAuthenticated_1.default);
providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/month-availability', celebrate_1.celebrate({
    params: {
        provider_id: celebrate_1.Joi.string().uuid().required(),
    },
}), providersMonthAvailabilityController.index);
providersRouter.get('/:provider_id/day-availability', celebrate_1.celebrate({
    params: {
        provider_id: celebrate_1.Joi.string().uuid().required(),
    },
}), providersDayAvailabilityController.index);
exports.default = providersRouter;
