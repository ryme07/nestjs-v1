import { registerDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res } from '@nestjs/common';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from "express"

@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }


    // register user with hashed password (bcrypt)
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


    //login user with compare user's password & use cookie with JWT
    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res() response: Response
    ) {
        const user = await this.userService.findOne({ email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({ id: user.id })

        response.cookie('jwt', jwt, { httpOnly: true })

        return user;
    }

    //AUTHENTICATED USER

    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt']

        const data = await this.jwtService.verifyAsync(cookie)

        return this.userService.findOne({ id: data['id'] })
    }
}
