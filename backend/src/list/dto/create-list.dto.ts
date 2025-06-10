import { IsString, IsNotEmpty, IsUUID, IsInt, Min, IsOptional } from 'class-validator';

export class CreateListDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUUID()
    boardId: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}
