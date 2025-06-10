import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';


@UseGuards(AuthGuard('jwt'))
@Controller('lists')
export class ListController {
    constructor(private readonly listService: ListService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Req() req, @Body() dto: CreateListDto) {
        return this.listService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req, @Query('boardId') boardId: string,) {
        return this.listService.findAll(boardId, req.user.userId);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateListDto) {
        return this.listService.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.listService.remove(id, req.user.userId);
    }
}
