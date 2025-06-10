import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Req() req, @Body() dto: CreateCardDto) {
        return this.cardService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req, @Query('listId') listId: string) {
        return this.cardService.findAll(listId, req.user.userId);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCardDto) {
        return this.cardService.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.cardService.remove(id, req.user.userId);
    }

}
