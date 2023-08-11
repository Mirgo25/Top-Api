import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    TopLevelCategory,
    TopPageDocument,
    TopPageModel,
} from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { subDays } from 'date-fns';
import { Types } from 'mongoose';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel.name)
        private readonly topPageModel: Model<TopPageDocument>,
    ) { }

    async create(dto: CreateTopPageDTO) {
        return this.topPageModel.create(dto);
    }

    async findById(id: string) {
        return this.topPageModel.findById(id).exec();
    }

    async findByAlias(alias: string) {
        return this.topPageModel.findOne({ alias }).exec();
    }

    async findAll() {
        return this.topPageModel.find({}).exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .aggregate()
            .match({
                firstCategory,
            })
            .group({
                _id: {
                    secondCategory: '$secondCategory',
                },
                pages: {
                    $push: {
                        alias: '$alias',
                        title: '$title',
                    }
                }
            })
            .exec();
    }

    async findByText(text: string) {
        console.log(text);
        return this.topPageModel.find({ $text: { $search: 'test' } }).exec();
    }

    async deleteById(id: string) {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string | Types.ObjectId, dto: CreateTopPageDTO) {
        return this.topPageModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
    }

    async findForHhUpdate(date: Date) {
        return this.topPageModel
            .find({
                firstCategory: 0,   // Courses
                $or: [
                    {
                        'hh.updatedAt': {
                            $lt: subDays(date, 1),
                        }
                    },
                    {
                        'hh.updatedAt': {
                            $exists: false,
                        }
                    },
                ],
            })
            .exec();
    }
}
