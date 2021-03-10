import { RoleService } from './role.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleUpdateDto } from './models/role-update.dto';

@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService) { }

    @Get()
    async all(): Promise<Role[]> {
        return this.roleService.all()
    }

    @Get(":id")
    async getById(@Param('id') id: number) {
        return this.roleService.getById({ id })
    }

    @Post()
    async create(@Body('name') name: string) {
        return this.roleService.create({ name })
    }

    @Put(':id')
    async updateRole(@Param('id') id: number, @Body('name') name: string) {
        await this.roleService.update(id, { name })
        return this.roleService.getById({ id })
    }

    @Delete(':id')
    async deleteById(@Param('id') id: number) {
        return this.roleService.delete(id)
    }
}


