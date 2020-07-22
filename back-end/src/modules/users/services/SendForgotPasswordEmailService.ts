import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import { IUserTokensRepository } from '../repositories/IUserTokensRepository';

interface RequestDTO {
  email: string;
}

@injectable()
class SendForgotEmailService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('MailProvider')
    private userTokensProvider: IUserTokensRepository,
  ) { }

  public async execute({ email }: RequestDTO): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError("User doesn't exists.");

    }

    const { id } = userExists;

    await this.userTokensProvider.generate(id);

    this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido');
  }
}

export default SendForgotEmailService;
