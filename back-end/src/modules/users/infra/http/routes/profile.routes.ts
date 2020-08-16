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
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string(),
        password_confirmation: Joi.string().valid(Joi.ref('password')),
        old_password: Joi.string(),
      })
      .with('password', 'old_password')
      .with('password', 'password_confirmation'),
  }),
  profileController.create,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
