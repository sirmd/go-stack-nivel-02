import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFoundInMonthFromProviderDTO from '../dtos/IFoundInMonthFromProviderDTO';
import IFoundInDayFromProviderDTO from '../dtos/IFoundInDayFromProviderDTO';

export interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFoundInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFoundInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
