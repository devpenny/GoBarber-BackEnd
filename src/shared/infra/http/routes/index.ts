import { Router } from 'express';
import appointmentsRouter from '../../../../modules/appointments/infra/http/routes/appointments.route';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions.route';
import usersRouter from '@modules/users/infra/http/routes/users.route';

const routes = Router();

routes.use('/sessions', sessionsRouter)
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);

export default routes;
