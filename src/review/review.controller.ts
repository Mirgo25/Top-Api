import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly telegramService: TelegramService,
    ) { }

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateReviewDTO) {
        return this.reviewService.create(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('notify')
    async notify(@Body() dto: CreateReviewDTO) {
        const message = `Name: ${dto.name}\n`
            + `Title: ${dto.title}\n`
            + `Description: ${dto.description}\n`
            + `Rating: ${dto.rating}\n`
            + `Product ID: ${dto.productId}`;
        return this.telegramService.sendMessage(message);
    }

    @Get(':id')
    async getById(@Param('id', IdValidationPipe) id: string) {
        return this.reviewService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedDoc = await this.reviewService.delete(id);
        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @Get('byProduct/:productId')
    async getByProduct(
        @Param('productId') productId: string,
        @UserEmail() email: string,
    ) {
        return this.reviewService.findByProductId(productId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('byProduct/:productId')
    async deleteByProduct(@Param('productId') productId: string) {
        const deletedDoc = await this.reviewService.deleteByProductId(
            productId,
        );
        return deletedDoc.deletedCount;
    }
}
