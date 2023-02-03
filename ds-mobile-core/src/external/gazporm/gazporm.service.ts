import { Injectable, UseFilters } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExistingSessionDto } from '../dto/res/existing-session.dto';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GazpromException } from '../../common/exceptions/gazprom.exception';
import { GazpromClientDto } from '../dto/req/gazprom-client.dto';
import { RegistrationSessionDto } from '../dto/req/registration-session.dto';
import { GazpromExceptionFilter } from '../../common/filters/gazprom-exception.filter';
import { SubscribtionStatusDto } from '../dto/res/subscribtion-status.dto';
import { GazpormErrorDto } from '../dto/res/gazporm-error.dto';

@UseFilters(GazpromExceptionFilter)
@Injectable()
export class GazpormService {
  private apiKey: string;
  private baseUrl: string;
  private partnerId: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('GAZPROM_BASE_URL');
    this.apiKey = configService.get<string>('GAZPROM_API_KEY');
    this.partnerId = configService.get<string>('GAZPROM_PARTNER_ID');
  }

  public async getExistingSession(
    clientId: string,
  ): Promise<ExistingSessionDto | GazpormErrorDto> {
    const config = this.setHeaders();
    let session: ExistingSessionDto | GazpormErrorDto;

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${clientId}/create/session`,
          null,
          config,
        ),
      );

      session = request.data;
    } catch (err) {
      const { response } = err;
      session = response.data;
    }

    return session;
  }

  public async createRegistrationSession(
    client: GazpromClientDto,
  ): Promise<ExistingSessionDto | GazpormErrorDto> {
    const config = this.setHeaders();
    let session: ExistingSessionDto | GazpormErrorDto;
    const body: RegistrationSessionDto = {
      partner_user_id: client.clientId,
      phone_number: client.phone,
    };

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/partners/${this.partnerId}/register/client`,
          body,
          config,
        ),
      );
      session = request.data;
    } catch (err) {
      const { response } = err;
      session = response.data;
    }

    return session;
  }

  public async getSubscriptionStatus(
    clientId: string,
  ): Promise<SubscribtionStatusDto | GazpormErrorDto> {
    const config = this.setHeaders();
    let subscibtionStatus: SubscribtionStatusDto | GazpormErrorDto;

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${clientId}/user-promotions`,
          config,
        ),
      );

      subscibtionStatus = request.data;
    } catch (err) {
      const { response } = err;
      subscibtionStatus = response.data;

      // console.log(`ERROR: ${res.statusCode}  ${res.statusMessage}`);
      // throw new GazpromException(res.statusCode, res.statusMessage);
    }

    return subscibtionStatus;
  }

  private setHeaders(): { headers: { Authorization: string } } {
    return {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
  }
}
