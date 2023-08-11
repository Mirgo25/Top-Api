import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

class HhDataDTO {
    @IsNumber()
    count: number;

    @IsNumber()
    juniorSalary: number;

    @IsNumber()
    middleSalary: number;

    @IsNumber()
    seniorSalary: number;

    @IsDate()
    updatedAt: Date;
}

class TopPageAdvantageDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateTopPageDTO {
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;

    @IsString()
    secondCategory: string;

    @IsString()
    alias: string;

    @IsString()
    title: string;

    @IsString()
    category: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HhDataDTO)
    hh?: HhDataDTO;

    @IsArray()
    @ValidateNested()
    @Type(() => TopPageAdvantageDTO)
    advantages: TopPageAdvantageDTO[];

    @IsString()
    seoText: string;

    @IsString()
    tagsTitle: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
