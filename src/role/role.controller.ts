import { RoleService } from './role.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleUpdateDto } from './models/role-update.dto';
import { HasPermission } from 'src/permission/has-permission.decorator';

@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService) { }

    @Get()
    @HasPermission('roles')
    async all(): Promise<Role[]> {
        return this.roleService.all(['permissions'])
    }

    @Get(":id")
    @HasPermission('roles')
    async getById(@Param('id') id: number) {
        return this.roleService.findOne({ id }, ['permissions'])
    }

    @Post()
    @HasPermission('roles')
    async create(@Body('name') name: string, @Body('permissions') permissionsIds: number[]) {
        return this.roleService.create({
            name,
            permissions: permissionsIds.map(id => ({ id }))
        })
    }

    @Put(':id')
    async updateRole(@Param('id') id: number, @Body('name') name: string, @Body('permissions') permissionsIds: number[]) {

        await this.roleService.update(id, { name })

        const role = await this.roleService.findOne({ id })

        return this.roleService.create({
            ...role,
            permissions: permissionsIds.map(id => ({ id }))
        })
    }

    @Delete(':id')
    @HasPermission('roles')
    async deleteById(@Param('id') id: number) {
        return this.roleService.delete(id)
    }
}


