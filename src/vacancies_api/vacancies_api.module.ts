import { Module } from '@nestjs/common';
import { VacanciesApiService } from './vacancies_api.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [VacanciesApiService],
    imports: [ConfigModule, HttpModule],
    exports: [VacanciesApiService],
})
export class VacanciesApiModule { }
