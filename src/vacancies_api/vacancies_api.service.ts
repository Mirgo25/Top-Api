import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_URL, SALARY_CLUSTER_ID, SALARY_CLUSTER_NOT_FOUND_ERROR } from './vacancies_api.constants';
import { lastValueFrom } from 'rxjs';
import { HhResponse } from './vacancies_api.models';
import { HhData } from 'src/top-page/top-page.model';

@Injectable()
export class VacanciesApiService {
    private token: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.token = this.configService.get('HH_TOKEN') || '';
    }

    async getData(text: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get<HhResponse>(API_URL.VACANCIES, {   // GET vacancies from external API
                    params: {
                        text,
                        cluster: true,
                    },
                    headers: {
                        'User-Agent': 'top_api/1.0 (mirgo@test.com)',
                        'Authorization': 'Bearer ' + this.token,
                    },
                })
            );
            return this.parseData(data);
        } catch (error) {
            Logger.error(error);
        }
    }

    private parseData(data: HhResponse): HhData {
        const salaryCluster = data.clusters.find((cluster) => cluster.id === SALARY_CLUSTER_ID);
        if (!salaryCluster) {
            throw new Error(SALARY_CLUSTER_NOT_FOUND_ERROR);
        }
        const juniorSalary = this.getSalaryFromString(salaryCluster.items[0].name);
        const middleSalary = this.getSalaryFromString(salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name);
        const seniorSalary = this.getSalaryFromString(salaryCluster.items[salaryCluster.items.length - 1].name);

        return {
            count: data.found,
            juniorSalary,
            middleSalary,
            seniorSalary,
            updatedAt: new Date(),
        };
    }

    private getSalaryFromString(s: string): number {
        const salaryRegExp = /(\d+)/g;
        const res = s.match(salaryRegExp)
        if (!res) {
            return 0;
        }

        return Number(res[0]);
    }
}
