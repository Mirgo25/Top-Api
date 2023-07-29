import { IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDTO {
    @IsString()
    name: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @Max(5, { message: 'Rating cannot be more than 5' })
    @Min(1, { message: 'Rating cannot be less than 1' })
    @IsNumber()
    rating: number;

    @IsString()
    productId: string;
}
