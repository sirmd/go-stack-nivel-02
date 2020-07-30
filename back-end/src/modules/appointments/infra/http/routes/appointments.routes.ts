import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/me', providerAppointmentsController.index);

appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;
