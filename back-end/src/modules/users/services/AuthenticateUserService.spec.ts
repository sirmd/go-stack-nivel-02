import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  let authenticateUser: AuthenticateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123345',
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123345',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toBe(user);
  });

  it('should not be able to authenticate with non-existing email', async () => {
    await expect(
      authenticateUser.execute({
        email: 'ops@example.com',
        password: '123345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123345',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: 'asdsadadsa',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
