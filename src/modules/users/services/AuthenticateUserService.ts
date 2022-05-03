import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../infra/typeorm/entities/User";
import authConfig from "../../../config/auth";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: Partial<User>
    token: string,
}

class AuthenticateUserService {
    private usersRepository: IUsersRepository;

    constructor(usersRepository: IUsersRepository){
        this.usersRepository = usersRepository;
    }

    public async execute({email, password}: RequestDTO): Promise<ResponseDTO> {

        const user = await this.usersRepository.findByEmail(email);

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
