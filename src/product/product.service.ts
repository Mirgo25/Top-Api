import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, ProductModel } from './product.model';
import { Model } from 'mongoose';
import { CreateProductDTO } from './dto/create-product.dto';
import { FindProductDTO } from './dto/find-product.dto';
import { ReviewDocument, ReviewModel } from 'src/review/review.model';

@Injectable()
export class ProductService {
    constructor(@InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>) { }

    async create(dto: CreateProductDTO) {
        return await this.productModel.create(dto);
    }

    async findById(id: string) {
        return await this.productModel.findById(id).exec();
    }

    async deleteById(id: string) {
        return await this.productModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateProductDTO) {
        return await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async findWithReviews(dto: FindProductDTO) {
        return await this.productModel.aggregate([
            {
                $match: {
                    categories: dto.category
                }
            },
            {
                $sort: {    // Use sort by id because of its stability for using 'limit' or 'skip' option
                    _id: 1
                }
            },
            {
                $limit: dto.limit
            },
            {
                $lookup: {  // Get data from 'reviewmodels' collection searched by local field '_id' matches 'productId' field in that collection
                    from: 'reviewmodels',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    reviewCount: {
                        $size: '$reviews'
                    },
                    reviewAvg: {
                        $avg: '$reviews.rating'
                    },
                    reviews: {
                        $function: {
                            body: function (reviews) {
                                reviews.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
                                return reviews;
                            },
                            args: ['$reviews'],
                            lang: 'js'
                        }
                    }
                }
            }
        ]).exec() as (ProductDocument & { review: ReviewDocument[], reviewCount: number, reviewAvg: number })[];
    }
}
