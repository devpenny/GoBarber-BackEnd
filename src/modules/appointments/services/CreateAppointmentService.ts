import { startOfHour } from 'date-fns';
import AppError from '../../../shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface RequestDTO {
    date: Date;
    provider_id: string;
}

class   CreateAppointmentService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(appointmentsRepository: IAppointmentsRepository) {
        this.appointmentRepository = appointmentsRepository;
    }

    public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        await this.appointmentRepository.findByDate(appointmentDate)
            .then(response => {
                if (response){
                    throw new AppError("This appointment time is already taken")
                }
            })

        const appointment = await this.appointmentRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
