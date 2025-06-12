import { Controller, UseGuards, Request, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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

    @Get()
    @UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )
    async findAll(
        @Query() { page = 1, take = 10 }: PaginationDto,
    ): Promise<Page<User>> {
        const skip = (page - 1) * take;
        return this.userService.findAll({ skip, take, page });
    }
}
