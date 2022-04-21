import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    date: Date;
    provider_id: string;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(AppointmentRepository)

        const appointmentDate = startOfHour(date);

        await appointmentRepository.findByDate(appointmentDate)
            .then(response => {
                if (response){
                    throw "This appointment time is already taken"
                }
            })

        const appointment = appointmentRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentRepository.save(appointment)

        return appointment;
    }
}

export default CreateAppointmentService;