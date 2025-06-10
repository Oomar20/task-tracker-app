import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {

    constructor(private readonly prisma: PrismaService) { }

    // creating new card
    async create(userId: string, dto: CreateCardDto) {
        const list = await this.prisma.list.findFirst({
            where: { id: dto.listId, board: { userId } }
        });

        if (!list) throw new NotFoundException('List not foudn or not owned by this user')

        return this.prisma.card.create({
            data: {
                title: dto.title,
                description: dto.description,
                deadline: dto.deadline,
                priority: dto.priority,
                order: dto.order,
                list: { connect: { id: dto.listId } }
            }
        })
    }

    // returning a specific card
    async findAll(listId: string, userId: string) {
        const list = await this.prisma.list.findFirst({
            where: { id: listId, board: { userId } }
        });

        if (!list) throw new NotFoundException('List not found or not owned by this user');

        return this.prisma.card.findMany({
            where: { listId },
            orderBy: { order: 'asc' }
        })
    }

    // updating a specific card
    async update(id: string, userId: string, dto: UpdateCardDto) {
        const existing = await this.prisma.card.findFirst({
            where: { id, list: { board: { userId } } },
        });

        if (!existing) throw new NotFoundException('Card not found or not owned by this user');

        return this.prisma.card.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.deadline ? { deadline: new Date(dto.deadline) } : {}),
            }
        })
    }

    // removing a specific card
    async remove(id: string, userId: string) {
        const existing = await this.prisma.card.findFirst({
            where: { id, list: { board: { userId } } }
        })

        if (!existing) throw new NotFoundException('Card not found or not owned by this user');

        await this.prisma.card.delete({
            where: { id }
        });

        return { success: true }
    }
}
