import { User } from './models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    //pagination
    async paginate(page: number = 1): Promise<any> {
        const itemsByPage: number = 15;

        const [users, total] = await this.userRepository.findAndCount({
            take: itemsByPage,
            skip: (page - 1) * itemsByPage
        })

        return {
            data: users.map(user => {
                const { password, ...data } = user;
                return data;
            }),
            meta: {
                total,
                page,
                last_page: Math.ceil(total / itemsByPage)
            }
        }


    }

    async create(data): Promise<User> {
        return this.userRepository.save(data)
    }

    async findOne(condition): Promise<User> {
        return this.userRepository.findOne(condition)
    }

    async updateUser(id: number, body): Promise<any> {
        return this.userRepository.update(id, body)
    }

    async deleteUser(id: number): Promise<any> {
        return this.userRepository.delete(id)
    }
}
