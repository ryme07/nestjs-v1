import { AuthService } from './../auth/auth.service';
import { UserUpdateDto } from './models/user-update.dto';
import { UserCreateDto } from './models/user-create.dto';
import { UserService } from './user.service';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from "bcryptjs"
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';


// Don't forget Exception Filters !! HERE

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService, private authService: AuthService) { }

    @Get()
    @HasPermission('users')
    async all(@Query('page') page: number = 1) {
        return this.userService.paginate(page, ['role'])
    }

    @Post()
    @HasPermission('users')
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12)

        const { role_id, ...data } = body

        return this.userService.create({
            ...data,
            password,
            role: { id: role_id }
        })
    }

    @Get(':id')
    @HasPermission('users')
    async getById(@Param('id') id: number) {
        return this.userService.findOne({ id }, ['role'])
    }


    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    ) {

        const id = await this.authService.userId(request)

        await this.userService.update(id, body)

        return this.userService.findOne({ id })
    }

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string
    ) {

        if (password !== password_confirm) {
            throw new BadRequestException('Password do not match');
        }

        const id = await this.authService.userId(request)
        const hashed = await bcrypt.hash(password, 12)

        await this.userService.update(id, {
            password: hashed
        })

        return this.userService.findOne({ id })
    }


    @Put(':id')
    @HasPermission('users')
    async updateUser(@Param('id') id: number, @Body() body: UserUpdateDto) {

        const { role_id, ...data } = body;

        await this.userService.update(id, {
            ...data,
            role: { id: role_id }
        })
        return this.userService.findOne({ id })
    }

    @Delete(':id')
    @HasPermission('users')
    async deleteUser(@Param('id') id: number) {
        return this.userService.delete(id)
    }
}
