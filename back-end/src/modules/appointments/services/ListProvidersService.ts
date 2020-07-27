import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

interface RequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: RequestDTO): Promise<User[] | []> {
    const users = await this.usersRepository.findAllProvidersExcept(user_id);

    if (!users) {
      throw new AppError('User not found');
    }

    return users;
  }
}

export default ListProvidersService;
