import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { Model, Schema as MSchema } from 'mongoose';
import { ReviewDocument } from './review.model';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(ReviewModel.name) private readonly reviewModel: Model<ReviewDocument>) { }

    async create(dto: CreateReviewDTO): Promise<ReviewDocument> {
        return this.reviewModel.create(dto);
    }

    async delete(id: string): Promise<ReviewDocument | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return this.reviewModel.find({ productId: new MSchema.Types.ObjectId(productId) }).exec();
    }

    async deleteByProductId(productId: string) {
        return this.reviewModel.deleteMany({ product: productId}).exec();
}
}
