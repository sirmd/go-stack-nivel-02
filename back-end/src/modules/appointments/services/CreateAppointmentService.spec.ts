import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";

describe('CreateAppointment', () => {

    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository
        )

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '12321312',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('12321312');

    });
    it('should not be able to create an appointment on the same date', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository
        )

        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '12321312',
        });
        
        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '12321312',
        })).rejects.toBeInstanceOf(AppError);


    });
});