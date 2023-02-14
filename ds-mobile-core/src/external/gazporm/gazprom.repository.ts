import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExistingSessionDto } from './dto/core/existing-session.dto';
import { GazpormErrorDto } from './dto/core/gazporm-error.dto';
import { AxiosResponse } from 'axios/index';
import { firstValueFrom } from 'rxjs';
import { GazpromClientDto } from './dto/core/gazprom-client.dto';
import { RegistrationSessionDto } from './dto/core/registration-session.dto';
import { SubscribtionStatusDto } from './dto/core/subscribtion-status.dto';

@Injectable()
export class GazpromRepository {
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
