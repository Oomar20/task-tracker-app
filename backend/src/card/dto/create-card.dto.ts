import { IsInt, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsISO8601()
    @IsOptional()
    deadline?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    priority?: number;

    @IsUUID()
    listId: string;

    @IsOptional()
    @IsInt()
    order: number;

}