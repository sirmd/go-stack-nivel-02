import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import AppError from "@shared/errors/AppError";
import FakeMailProvider from "@shared/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotEmail: SendForgotPasswordEmailService;

describe('SendForgotEmail', () => {

  // Instancia os repositórios antes de cada teste, é utilizado o beforeEach
  // para não repetir código dentro dos testes
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository);
  });

  it('should be able to recover the password using the email', async () => {

    // 'Espia' a função deleteFile do Storage
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await sendForgotEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();

  });
  it('should not be able to recover password for a non-existing email', async () => {

    await expect(sendForgotEmail.execute({
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should generate forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);

  });
});
