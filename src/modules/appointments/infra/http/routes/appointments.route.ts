import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '../../../services/CreateAppointmentService';
import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//     console.log(req.user.id)

//     const appointments = await appointmentsRepository.find();

//     return res.json(appointments);
// });

appointmentsRouter.post('/', async (req, res) => {

    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const appointmentsRepository = new AppointmentsRepository();
    const createAppointment = new CreateAppointmentService(appointmentsRepository);

    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
    });

    return res.json(appointment);
});

export default appointmentsRouter;
