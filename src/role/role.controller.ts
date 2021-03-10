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
    async create(@Body('name') name: string, @Body('permissions') permissionsIds: number[]) {
        return this.roleService.create({
            name,
            permissions: permissionsIds.map(id => ({ id }))
        })
    }

    @Put(':id')
    async updateRole(@Param('id') id: number, @Body('name') name: string, @Body('permissions') permissionsIds: number[]) {

        await this.roleService.update(id, { name })

        const role = await this.roleService.getById({ id })

        return this.roleService.create({
            ...role,
            permissions: permissionsIds.map(id => ({ id }))
        })
    }

    @Delete(':id')
    async deleteById(@Param('id') id: number) {
        return this.roleService.delete(id)
    }
}


