import { Router } from 'express';
import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import multer from 'multer';
import uploadConfig from "../config/upload";
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig)

usersRouter.get("/", async (req, res)=>{
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();
    return res.json(users);
})

usersRouter.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const createUser = new CreateUserService;

        const user = await createUser.execute({
            name: name,
            email: email,
            password: password
        });

        return res.json(user);

    } catch (err) {
        return res.status(400).json({ error: err });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single("avatar"),
    async (req, res)=>{
        try {
            const updateUserAvatar = new UpdateUserAvatarService()

            const user = await updateUserAvatar.execute({
                user_id: req.user.id,
                avatarFilename: req.file?.filename,
            })

            return res.json(user)

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
);

export default usersRouter;
