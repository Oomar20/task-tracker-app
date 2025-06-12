import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { User } from '@prisma/client';

export interface Page<T> {
    data: T[];
    total: number;
    pages: number;
    page: number;
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll({
        skip = 0,
        take = 10,
        page = 1,
    }: {
        skip?: number;
        take?: number;
        page?: number;
    }): Promise<Page<User>> {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({ skip, take }),
            this.prisma.user.count(),
        ]);

        const pages = Math.ceil(total / take);
        return { data, total, pages, page };
    }
}
