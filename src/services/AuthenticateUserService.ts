import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import User from "../models/User";
import authConfig from "../config/auth";

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
            throw "Invalid Email/Password combination."
        }

        await compare(password, user.password).then(response=>{
            if (!response){
                throw "Invalid Email/Password combination."
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
