import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import { uuid } from "uuidv4";

class UserRepository implements IUsersRepository {
    private users: User[] = []

    public async findById(id: string): Promise<User | undefined> {
        const user = this.users.find(user=>{
            return user.id === id;
        })

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => {
          return user.email === email;
        })

        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        user.id = uuid();

        const newUser = {
            ...user,
            ...userData
        }

        this.users.push(newUser);

        return user;
    }

    public async save(user: User): Promise<User> {
        const index =  this.users.findIndex(foundUser=>{
            return foundUser.id === user.id
        })

        this.users[index] = user;

        return user;
    }
}

export default UserRepository
