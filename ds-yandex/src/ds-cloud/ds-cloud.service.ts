import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Carwash } from '../carwash/dto';
import { HeadersReq } from './dto/headers.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

/*
    TODO
    1.  Create custom exception for ds-cloud errors
    2.  Add comments
 */
@Injectable()
export class DsCloudService {
  private apiKey: string;
  private baseUrl: string;
  private sourceCode: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = configService.get<string>('DS_CLOUD_API_KEY');
    this.baseUrl = configService.get<string>('DS_CLOUD_URL');
    this.sourceCode = configService.get<string>('SOURCE_CODE');
  }

  public async getCarWashList(): Promise<Observable<Carwash[]>> {
    const headersReq: any = this.setHeaders(this.apiKey);
    const source = {
      code: this.sourceCode,
    };

    try {
      return await this.httpService
        .get(
          `${this.baseUrl}/external/collection/list?code=${this.sourceCode}`,
          { headers: headersReq },
        )
        .pipe(
          map((response: AxiosResponse) => {
            return response.data;
          }),
        );
    } catch (e) {
      console.log(e);
      throw new HttpException(
        `Error getting data`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private setHeaders(apiKey: string): HeadersReq {
    return {
      akey: apiKey,
    };
  }
}
