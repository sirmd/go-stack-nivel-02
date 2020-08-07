"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var celebrate_1 = require("celebrate");
var AppointmentsController_1 = __importDefault(require("../controllers/AppointmentsController"));
var ProviderAppointmentsController_1 = __importDefault(require("../controllers/ProviderAppointmentsController"));
var appointmentsRouter = express_1.Router();
var appointmentController = new AppointmentsController_1.default();
var providerAppointmentsController = new ProviderAppointmentsController_1.default();
appointmentsRouter.use(ensureAuthenticated_1.default);
appointmentsRouter.get('/me', providerAppointmentsController.index);
appointmentsRouter.post('/', celebrate_1.celebrate({
    body: {
        provider_id: celebrate_1.Joi.string().uuid().required(),
        user_id: celebrate_1.Joi.string().uuid().required(),
        date: celebrate_1.Joi.date().required().raw(),
    },
}), appointmentController.create);
exports.default = appointmentsRouter;
