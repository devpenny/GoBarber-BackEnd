import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { getRepository, Repository } from "typeorm";
import User from "../entities/User";

class UserRepository implements IUsersRepository{
    private ormRepository: Repository<User>;

    constructor(){
        this.ormRepository = getRepository(User);
    }


    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({where: {id: id}});

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({where: {email: email}});

        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        await this.ormRepository.save(user);

        return user;
    }
}

export default UserRepository
