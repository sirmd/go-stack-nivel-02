import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }

  public async execute({ name, email, password }: RequestDTO): Promise<User> {

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
