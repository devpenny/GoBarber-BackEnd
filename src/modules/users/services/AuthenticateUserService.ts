import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import User from "../infra/typeorm/entities/User";
import authConfig from "../../../config/auth";
import AppError from "../../../shared/errors/AppError";

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: Partial<User>
    token: string,
}

class AuthenticateUserService {
    public async execute({email, password}: RequestDTO): Promise<ResponseDTO> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({where: {email: email}});

        if (!user) {
            throw new AppError("Invalid Email/Password combination.", 401)
        }

        await compare(password, user.password).then(response=>{
            if (!response){
                throw new AppError("Invalid Email/Password combination.", 401)
            }
        })

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret , {
            subject: user.id,
            expiresIn: expiresIn,
        })

        const {password: discardedPassword, ...userWithoutPassword} = user;

        return {
            user: userWithoutPassword,
            token: token,
        }
    }
}

export default AuthenticateUserService;
