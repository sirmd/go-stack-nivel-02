import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

  ) { }

  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
