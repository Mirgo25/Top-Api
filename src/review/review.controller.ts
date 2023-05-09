import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post('create')
    async create(@Body() dto: CreateReviewDTO) {
        return await this.reviewService.create(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedDoc = await this.reviewService.delete(id);
        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }

    @Get('byProduct/:productId')
    async getByProduct(@Param('productId') productId: string) {
        console.log("in controller - productId: ", productId)
        return this.reviewService.findByProductId(productId);
    }

    @Delete('byProduct/:productId')
    async deleteByProduct(@Param('productId') productId: string) {
        const deletedDoc = await this.reviewService.deleteByProductId(productId);
        return deletedDoc.deletedCount;
    }
}
