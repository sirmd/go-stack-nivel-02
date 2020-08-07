import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from './ListProviderAppointmentService';

describe('ListProviderAvailability', () => {
  let listProviderAppointmentService: ListProviderAppointmentService;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let fakeCacheProvider: FakeCacheProvider;
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentService = new ListProviderAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific date', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'client',
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 15, 0, 0),
      user_id: 'client2',
    });

    const appointments = await listProviderAppointmentService.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
