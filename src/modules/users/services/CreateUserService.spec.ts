import FakeUsersRepository from '@modules/users/repositories/FakeUsersRepository'
import AppError from '@shared/errors/AppError';
import { isTryStatement } from 'typescript';
import CreateUserService from './CreateUserService';

describe('CreateUser', ()=>{
    it('should be able to create a new user', async ()=>{
        const fakeUserRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUserRepository);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123123'
        })

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a user with an existing registered email', async ()=>{
        const fakeUserRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUserRepository);

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123123'
        })

        await expect(createUser.execute({
            name: 'John Does',
            email: 'johndoe@test.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    })
})
