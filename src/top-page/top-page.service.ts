import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPageDocument, TopPageModel } from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';

@Injectable()
export class TopPageService {
    constructor(@InjectModel(TopPageModel.name) private readonly topPageModel: Model<TopPageDocument>) { }

    async create(dto: CreateTopPageDTO) {
        return await this.topPageModel.create(dto);
    }

    async findById(id: string) {
        return await this.topPageModel.findById(id).exec();
    }

    async findByAlias(alias: string) {
        return await this.topPageModel.findOne({ alias }).exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return await this.topPageModel.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 }).exec();
    }

    async deleteById(id: string) {
        return await this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateTopPageDTO) {
        return await this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
}
