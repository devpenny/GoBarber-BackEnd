import { hash } from "bcryptjs";
import AppError from "../../../shared/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository"

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
    private usersRepository: IUsersRepository;

    constructor(usersRepository: IUsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async execute({name, email, password}: RequestDTO): Promise<ResponseDTO> {

        await this.usersRepository.findByEmail(email).then(response => {
            if (response){
                throw new AppError("Email already taken!")
            }
        })

        const hashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name: name,
            email: email,
            password: hashedPassword,
        })

        const userResponse: ResponseDTO = {
            id: user.id,
            name: name,
            email: email,
        }

        return userResponse
    }
}

export default CreateUserService;
