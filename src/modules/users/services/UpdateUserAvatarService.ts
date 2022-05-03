import User from "../infra/typeorm/entities/User"
import path from "path"
import uploadConfig from "../../../config/upload";
import fs from "fs";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository"

interface RequestDTO{
    user_id: string,
    avatarFilename: string | undefined
}

interface ResponseDTO {
    user: Partial<User>;
}

class UpdateUserAvatarService {
    private usersRepository: IUsersRepository;

    constructor(usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute({ user_id, avatarFilename}: RequestDTO): Promise<ResponseDTO>{
        const user = await this.usersRepository.findById(user_id);

        if (!user){
            throw new AppError("Only authenticated users can change avatar.", 401)
        }

        if (user.avatar) {
            //Delete old avatar

            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        if (avatarFilename!==undefined){
            user.avatar = avatarFilename;
        }

        await this.usersRepository.save(user)

        const {password, ...userWithoutPassword} = user

        return {
            user: userWithoutPassword
        }
    }
}

export default UpdateUserAvatarService
