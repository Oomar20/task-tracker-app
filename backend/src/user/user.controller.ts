import { Controller, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService, Page } from './user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import type { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return { userId: req.user.userId, email: req.user.email };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(
        @Query() { skip = 0, take = 10 }: PaginationDto,
    ): Promise<Page<User>> {
        return this.userService.findAll({ skip, take });
    }
}
