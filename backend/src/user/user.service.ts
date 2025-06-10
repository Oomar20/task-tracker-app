import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { User } from '@prisma/client';

export interface Page<T> {
    data: T[];
    total: number;
}

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll({ skip = 0, take = 10 }: { skip?: number; take?: number }): Promise<Page<User>> {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({ skip, take, orderBy: { email: 'asc' } }),
            this.prisma.user.count(),
        ]);
        return { data, total };
    }
}
