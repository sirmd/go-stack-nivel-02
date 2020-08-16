import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/me', providerAppointmentsController.index);

appointmentsRouter.post(
  '/',
  celebrate({
    body: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required().raw(),
    },
  }),
  appointmentController.create,
);

export default appointmentsRouter;
