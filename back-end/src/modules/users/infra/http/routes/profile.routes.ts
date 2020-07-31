import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();
profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        nome: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().optional(),
        old_password: Joi.string().optional().valid(Joi.ref('password')),
      })
      .with('password', 'old_password'),
  }),
  profileController.create,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
