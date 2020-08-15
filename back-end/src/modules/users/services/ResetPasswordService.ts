import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import { IUsersRepository } from '../repositories/IUsersRepository';
import { IUserTokensRepository } from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: RequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    // Se o momento atual for 2h depois da criação, o token expirou
    const tokenCreation = userToken.created_at;
    const compareDate = addHours(tokenCreation, 2);

    if (isAfter(new Date(Date.now()), compareDate)) {
      throw new AppError('Token expired');
    }

    const user = await this.usersRepository.findById(userToken?.user_id);
    if (!user) {
      throw new AppError('User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
