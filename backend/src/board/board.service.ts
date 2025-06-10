import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
    constructor(private readonly prisma: PrismaService) { }

    // creating a new board tied to the userId
    async create(userId: string, dto: CreateBoardDto) {
        return this.prisma.board.create({
            data: {
                title: dto.title,
                user: { connect: { id: userId } }
            }
        })
    }

    // returning all boards that belong to a user
    async findAllByUser(userId: string) {
        return this.prisma.board.findMany({
            where: { userId },
            orderBy: { title: 'asc' }
        })
    }

    // returning a specific board
    async findOne(id: string, userId: string) {
        const board = await this.prisma.board.findFirst({
            where: { id, userId }
        });
        if (!board) {
            throw new NotFoundException('Board Not Found')
        };
        return board;
    }

    // updating a board
    async update(id: string, userId: string, dto: UpdateBoardDto) {
        await this.findOne(id, userId);

        return this.prisma.board.update({
            where: { id },
            data: { title: dto.title }
        })
    }

    // removing a board
    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        await this.prisma.board.delete({
            where: { id }
        })

        return { success: true }
    }

}
