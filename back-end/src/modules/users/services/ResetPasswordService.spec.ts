
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import AppError from "@shared/errors/AppError";
import FakeMailProvider from "@shared/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('resetPassword', () => {

  // Instancia os repositórios antes de cada teste, é utilizado o beforeEach
  // para não repetir código dentro dos testes
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository);
  });

  it('should be able to reset the password', async () => {

    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(id);

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const user = await fakeUsersRepository.findById(id);

    expect(user?.password).toBe('123123');

  });
  it('should be able to generate a hash for the password', async () => {


  });
  it('token should expire', async () => {


  });
  it('should throw error if userToken does not exists', async () => {


  });
  it('should throw error if user does not exists', async () => {


  });
});
