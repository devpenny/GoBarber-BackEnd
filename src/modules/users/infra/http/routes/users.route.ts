import { Router } from 'express';
import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import CreateUserService from '@modules/users/services/CreateUserService';
import multer from 'multer';
import uploadConfig from "@config/upload";
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig)

usersRouter.get("/", async (req, res)=>{
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();
    return res.json(users);
})

usersRouter.post('/', async (req, res) => {

    const { name, email, password } = req.body;

    const createUser = new CreateUserService;

    const user = await createUser.execute({
        name: name,
        email: email,
        password: password
    });

    return res.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single("avatar"),
    async (req, res)=>{
        const updateUserAvatar = new UpdateUserAvatarService()

        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFilename: req.file?.filename,
        })

        return res.json(user)
    }
);

export default usersRouter;
