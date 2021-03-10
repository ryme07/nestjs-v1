import { PaginatedResult } from './paginated-result.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService {

    protected constructor(protected readonly repository: Repository<any>) {

    }

    async all(relations = []): Promise<any[]> {
        return this.repository.find({ relations });
    }

    //pagination
    async paginate(page: number = 1, relations = []): Promise<PaginatedResult> {
        const itemsByPage: number = 15;

        const [data, total] = await this.repository.findAndCount({
            take: itemsByPage,
            skip: (page - 1) * itemsByPage,
            relations
        })

        return {
            data: data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / itemsByPage)
            }
        }
    }

    async create(data): Promise<any> {
        return this.repository.save(data)
    }

    async findOne(condition, relations = []): Promise<any> {
        return this.repository.findOne(condition, { relations })
    }

    async update(id: number, body): Promise<any> {
        return this.repository.update(id, body)
    }

    async delete(id: number): Promise<any> {
        return this.repository.delete(id)
    }
}
