import { CommonModule } from './../common/common.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from "../user/user.module";


@Module({
  imports: [
    forwardRef(() => UserModule),
    CommonModule

  ],
  controllers: [AuthController]
})
export class AuthModule { }
