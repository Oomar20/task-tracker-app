import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createdBoard(@Req() req, @Body() dto: CreateBoardDto) {
        const userId = req.user.userId;
        return this.boardService.create(userId, dto);
    }

    @Get()
    async getAllBoards(@Req() req) {
        const userId = req.user.userId;
        return this.boardService.findAllByUser(userId);
    }

    @Get(':id')
    async getBoardById(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.boardService.findOne(id, userId)
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async updateboard(@Req() req, @Param('id') id: string, @Body() dto: UpdateBoardDto) {
        const userId = req.user.userId;
        return this.boardService.update(id, userId, dto);
    }

    @Delete(':id')
    async deleteBoard(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.boardService.remove(id, userId);
    }

}
