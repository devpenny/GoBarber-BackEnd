import { Router } from 'express';
import AuthenticateUserService from '../../../services/AuthenticateUserService';
import UserRepository from '../../typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const {email, password} = req.body

    const usersRepository = new UserRepository();
    const authenticateUser = new AuthenticateUserService(usersRepository);

    const {user, token} = await authenticateUser.execute({
        email: email,
        password: password,
    });

    return res.json({user, token});
});

export default sessionsRouter;
