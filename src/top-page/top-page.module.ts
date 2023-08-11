import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';
import { VacanciesApiModule } from 'src/vacancies_api/vacancies_api.module';

@Module({
    controllers: [TopPageController],
    imports: [
        MongooseModule.forFeature([
            {
                name: TopPageModel.name,
                schema: TopPageSchema,
            },
        ]),
        VacanciesApiModule,
    ],
    providers: [TopPageService],
    exports: [TopPageService],
})
export class TopPageModule { }
