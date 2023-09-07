import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, LoggerService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StartEquipmentRequest } from './dto/req/start-equipment-request.dto';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger();
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService /*     @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService, */,
  ) {}

  public async start(
    startEquipmentReq: StartEquipmentRequest,
    deviceId: string,
    devNomer: string,
  ): Promise<Observable<any>> {
    const options: any = this.setHeaders();
    const body: StartEquipmentRequest = {
      GVLCardNum: devNomer,
      GVLCardSum: startEquipmentReq.GVLCardSum,
      GVLSource: 318,
    };
    this.logger.log(
      `Equipment start request: ${JSON.stringify(
        startEquipmentReq,
      )}  Auth UNQ card number: ${devNomer} `,
    );
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
