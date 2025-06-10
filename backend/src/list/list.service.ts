import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
    constructor(private prisma: PrismaService) { }

    // creating new list
    async create(userId: string, dto: CreateListDto) {
        const board = await this.prisma.board.findFirst({
            where: { id: dto.boardId, userId },
        })

        if (!board) throw new NotFoundException('Board not found');

        return this.prisma.list.create({
            data: {
                title: dto.title,
                order: dto.order,
                board: { connect: { id: dto.boardId } },
            }
        })
    }

    // returning all lists
    async findAll(boardId: string, userId: string) {
        const board = await this.prisma.board.findFirst({
            where: { id: boardId, userId },
        })

        if (!board) throw new NotFoundException('Board not found');

        return this.prisma.list.findMany({
            where: { boardId },
            orderBy: { order: 'asc' }
        })
    }

    // updating a specific list
    async update(id: string, userId: string, dto: UpdateListDto) {
        const existing = await this.prisma.list.findFirst({
            where: { id, board: { userId }, },
        })

        if (!existing) throw new NotFoundException('List not found')

        return this.prisma.list.update({
            where: { id },
            data: {
                ...dto
            }
        })
    }

    // removing a specific list
    async remove(id: string, userId: string) {
        const existing = await this.prisma.list.findFirst({
            where: { id, board: { userId }, },
        })

        if (!existing) throw new NotFoundException('List not found')

        await this.prisma.list.delete({ where: { id } });
        return { success: true };
    }

}
