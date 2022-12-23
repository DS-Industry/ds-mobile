import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Box, Carwash } from '../carwash/dto';
import { HeadersReq } from './dto/headers.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { DsCloudEquipmentRequest } from '@/ds-cloud/dto/req/ds-cloud-equipment-request.dto';
import { StartEquipmentErrorRes } from '@/ds-cloud/dto/res/start-equipment-error-res.dto';
import { BayUnavailableException } from '@/common/exceptions';

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
      throw new HttpException(
        `Error getting data`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async getBay(carwashId: string, bayNumber: number): Promise<Box> {
    const headersReq: any = this.setHeaders(this.apiKey);

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/external/collection/device?carwashId=${carwashId}&bayNumber=${bayNumber}`,
          { headers: headersReq },
        ),
      );

      return response.data;
      /*
        .pipe(
          map((response: AxiosResponse) => {
            return response.data;
          }),
        );
        
       */
    } catch (e) {
      throw new HttpException(
        `Error getting data`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async startEquipment(deviceId: number, sum: number) {
    const headersReq: any = this.setHeaders(this.apiKey);
    const body: DsCloudEquipmentRequest = {
      GVLCardNum: '0',
      GVLCardSum: sum.toString(),
      GVLSource: this.sourceCode,
    };

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/external/mobile/write/${deviceId}`,
          body,
          { headers: headersReq },
        ),
      );
      return response.status;
    } catch (e) {
      const response: StartEquipmentErrorRes = e.response.data;
      throw new BayUnavailableException(response, response.statusCode, {
        reason: e.stack,
      });
    }
  }

  private setHeaders(apiKey: string): HeadersReq {
    return {
      akey: apiKey,
    };
  }
}
