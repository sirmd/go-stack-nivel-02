import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import { IAppointmentsRepository } from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequestDTO): Promise<Appointment[]> {
    // Chave do cache
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          day,
          month,
          provider_id,
          year,
        },
      );

      await this.cacheProvider.save(cacheKey, appointments);
    }
    return appointments;
  }
}

export default ListProviderAppointmentService;
