import { PermissionService } from './permission.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permission } from './permission.entity';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Get()
    async all(): Promise<Permission[]> {
        return this.permissionService.all()
    }
}
