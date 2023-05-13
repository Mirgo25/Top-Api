import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDTO) {
        const oldUser = await this.authService.findUser(dto.login);
        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        return await this.authService.createUser(dto);
    }

    @HttpCode(200) // Handle StatusCode because POST return 201 by default, but Login does not change or create any data
    @Post('login')
    async login(@Body() { login, password }: AuthDTO) {
        const { email } = await this.authService.validateUser(login, password);
        return await this.authService.login(email);
    }
}
