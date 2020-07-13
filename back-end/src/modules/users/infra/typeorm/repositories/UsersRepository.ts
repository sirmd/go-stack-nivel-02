

import { Repository, getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';


class UsersRepository implements IUsersRepository {

  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {

    const findUser = await this.ormRepository.findOne(id);

    return findUser || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUserWithEmail = await this.ormRepository.findOne(email);

    return findUserWithEmail || undefined;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const User = this.ormRepository.create(userData);

    await this.ormRepository.save(User);

    return User;
  }

  public async save(user: User): Promise<User> {
    const savedUser = await this.ormRepository.save(user);

    return savedUser;
  }

}

export default UsersRepository;
