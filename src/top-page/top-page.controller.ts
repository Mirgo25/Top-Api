import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDTO } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { VacanciesApiService } from 'src/vacancies_api/vacancies_api.service';

@Controller('top-page')
export class TopPageController {
    constructor(
        private readonly topPageService: TopPageService,
        private readonly vacanciesApiService: VacanciesApiService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDTO) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id', IdValidationPipe) id: string) {
        const topPage = await this.topPageService.findById(id);
        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return topPage;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const topPageByAlias = await this.topPageService.findByAlias(alias);
        if (!topPageByAlias) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return topPageByAlias;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedTopPage = await this.topPageService.deleteById(id);
        if (!deletedTopPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDTO,
    ) {
        const updatedTopPage = await this.topPageService.updateById(id, dto);
        if (!updatedTopPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return updatedTopPage;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async findByCategory(@Body() dto: FindTopPageDTO) {
        const topPagesByCategory = await this.topPageService.findByCategory(
            dto.firstCategory,
        );
        if (!topPagesByCategory) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return topPagesByCategory;
    }

    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        const topPagesByCategory = await this.topPageService.findByText(text);
        return topPagesByCategory;
    }

    @Post('test')
    async test() {
        const data = await this.topPageService.findForHhUpdate(new Date());
        for (const page of data) {
            const HhData = await this.vacanciesApiService.getData(page.category);
            page.hh = HhData;
            // await this.sleep();
            await this.topPageService.updateById(page._id, page);
        }
    }

    // sleep() {
    //     return new Promise<void>((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve();
    //         }, 1000);
    //     });
    // }
}
