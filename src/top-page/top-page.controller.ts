import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDTO } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('top-page')
export class TopPageController {
    @Post('create')
    async create(@Body() dto: Omit<TopPageModel, '_id'>) {}

    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {}

    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {}

    @Patch(':id')
    async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: TopPageModel) {}

    @HttpCode(200)
    @Post()
    async find(@Body() dto: FindTopPageDTO) {}
}
