import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserAvatar: UpdateUserAvatarService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to Update User Avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to Update User Avatar for an unknown user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'avatar.jpg',
        user_id: 'non-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old when updating the new one', async () => {
    // 'Espia' a função deleteFile do Storage
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar2.jpg',
      user_id: user.id,
    });

    // Verifica se a função foi chamada para deletar o 1º avatar
    await expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    await expect(user.avatar).toBe('avatar2.jpg');
  });
});
