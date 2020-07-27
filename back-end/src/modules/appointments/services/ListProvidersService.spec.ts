import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

describe('ShowProfile', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John One',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user3 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: user.id,
    });

    await expect(providers).toEqual([user1, user2, user3]);
  });
});
