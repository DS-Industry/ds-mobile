import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StartEquipmentRequest } from './dto/req/start-equipment-request.dto';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async start(
    startEquipmentReq: StartEquipmentRequest,
    deviceId: string,
  ): Promise<Observable<any>> {
    const options: any = this.setHeaders();
    const body = startEquipmentReq;
    return this.httpService
      .post(
        `${this.configService.get<string>(
          'DS_CLOUD_URL',
        )}/external/mobile/write/${deviceId}`,
        body,
        options,
      )
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
      );
  }

  private setHeaders(): { headers: { akey: string } } {
    return {
      headers: {
        akey: this.configService.get<string>('DS_CLOUD_API_KEY'),
      },
    };
  }
}
