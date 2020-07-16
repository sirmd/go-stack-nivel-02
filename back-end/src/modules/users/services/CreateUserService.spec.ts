import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";
import AppError from "@shared/errors/AppError";

describe('CreateUser', () => {

    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(
            fakeUsersRepository
        )

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123345',
        });

        expect(user).toHaveProperty('id');

    });

    it('should not be able to create a new user with an existing email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(
            fakeUsersRepository
        )

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123345',
        });

        expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123345',
        })).rejects.toBeInstanceOf(AppError);

    });
});