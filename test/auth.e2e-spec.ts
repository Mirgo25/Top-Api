import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDTO } from '../src/auth/dto/auth.dto';


const loginDto: AuthDTO = {
    login: 'test@test.com',
    password: '1234'
};

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(200)
            .then(({ body }: request.Response) => {
                token = body.access_token;
                expect(token).toBeDefined();
            });
    });

    it('/auth/login (POST) - fail login', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, login: 'Wrong@login.com' })
            .expect(401, {
                statusCode: 401,
                message: "The user with such email is not found",
                error: "Unauthorized"
            });
    });

    it('/auth/login (POST) - fail password', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, password: 'wrong_pass' })
            .expect(401, {
                statusCode: 401,
                message: "The user has the wrong password",
                error: "Unauthorized"
            });
    });

    afterAll(() => {
        disconnect();
    });
});
