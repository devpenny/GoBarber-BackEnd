import { getRepository } from "typeorm";
import User from "../infra/typeorm/entities/User";
import { hash } from "bcryptjs";
import AppError from "../../../shared/errors/AppError";

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

interface ResponseDTO {
    id: string;
    name: string;
    email: string;
}

class CreateUserService {
    public async execute({name, email, password}: RequestDTO): Promise<ResponseDTO> {
        const usersRepository = getRepository(User);

        //Check if user already exists (with email reference)
        await usersRepository.findOne({
            where: {email: email}
        }).then(response => {
            if (response){
                throw new AppError("Email already taken!")
            }
        })

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name: name,
            email: email,
            password: hashedPassword,
        })

        await usersRepository.save(user)

        const userResponse: ResponseDTO = {
            id: user.id,
            name: name,
            email: email,
        }

        return userResponse
    }
}

export default CreateUserService;
