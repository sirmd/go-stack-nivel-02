import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

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

    await this.cacheProvider.invalidatePrefix('provider-appointments');
    await this.cacheProvider.invalidatePrefix('providers-list');

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
