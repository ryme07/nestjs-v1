import { registerDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from "bcryptjs"

@Controller()
export class AuthController {

    constructor(private userService: UserService) { }

    @Post('register')
    async register(@Body() body: registerDto) {

        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Password do not match');
        }
        const hashed = await bcrypt.hash(body.password, 12)
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed
        })
    }
}
