import { Role } from './role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) { }

    async all(): Promise<Role[]> {
        return this.roleRepository.find()
    }


    async create(data): Promise<Role> {
        return this.roleRepository.save(data)
    }

    async getById(condition): Promise<Role> {
        return this.roleRepository.findOne(condition, { relations: ['permissions'] });
    }


    async update(id: number, body): Promise<any> {
        return this.roleRepository.update(id, body);
    }

    async delete(id: number): Promise<any> {
        return this.roleRepository.delete(id)
    }


}
