import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let createAppointment: CreateAppointmentService;
  let fakeCacheProvider: FakeCacheProvider;
  let fakeNotificationsRepository: FakeNotificationsRepository;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 15).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 6, 20, 16),
      provider_id: '12321312',
      user_id: 'user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12321312');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 6, 20, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 10).getTime();
    });
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12321312',
      user_id: 'user',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12321312',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 27, 21).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 27, 20),
        provider_id: '12321312',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with user_id equal to provider_id', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 27, 16).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 27, 17),
        provider_id: '12321312',
        user_id: '12321312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 8AM and after 5PM', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 27, 16).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 28, 7),
        provider_id: '12321312',
        user_id: '12321312',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 28, 18),
        provider_id: '12321312',
        user_id: '12321312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
