import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    
    @Post('register')
    async register(@Body() dto: AuthDTO) {

    }

    @HttpCode(200) // Handle StatusCode because POST return 201 by default, but Login does not change or create any data
    @Post('login')
    async login(@Body() dto: AuthDTO) {

    }
}
