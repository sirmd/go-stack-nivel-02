import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import FakeStorageProvider from "@shared/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {

  it('should be able to Update User Avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('avatar.jpg');

  });

  it('should not be able to Update User Avatar for an unknown user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    expect(updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: 'non-user'
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should delete old when updating the new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    // 'Espia' a função deleteFile do Storage
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar2.jpg',
      user_id: user.id,
    });

    // Verifica se a função foi chamada para deletar o 1º avatar
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');

  });
});
