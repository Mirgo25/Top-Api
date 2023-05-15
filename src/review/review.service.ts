import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { Model, Types } from 'mongoose';
import { ReviewDocument } from './review.model';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(ReviewModel.name) private readonly reviewModel: Model<ReviewDocument>) { }

    async create(dto: CreateReviewDTO): Promise<ReviewDocument> {
        return await this.reviewModel.create(dto);
    }

    async getById(id: string) {
        return await this.reviewModel.find({ _id: new Types.ObjectId(id) }).exec();
    }

    async delete(id: string): Promise<ReviewDocument | null> {
        return await this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return await this.reviewModel.find({ productId: productId }).exec();
    }

    async deleteByProductId(productId: string) {
        return await this.reviewModel.deleteMany({ product: productId }).exec();
    }
}
