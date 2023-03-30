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
import { UpdateStatusDto } from './dto/req/update-status.dto';
import { UpdateStatusResponseDto } from './dto/res/update-status-response.dto';
import { GazpromUpdate } from './dto/core/gazprom-update.dto';

@Injectable()
export class GazpromRepository {
  private apiKey: string;
  private baseUrl: string;
  private partnerId: string;
  private promoFilter: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('GAZPROM_BASE_URL');
    this.apiKey = configService.get<string>('GAZPROM_API_KEY');
    this.partnerId = configService.get<string>('GAZPROM_PARTNER_ID');
    this.promoFilter = configService.get<string>('PROMO_FILTER');
  }

  public async getExistingSession(
    clientId: string,
  ): Promise<ExistingSessionDto | GazpormErrorDto> {
    const config = this.setHeaders();

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${clientId}/create/session`,
          null,
          config,
        ),
      );
      //TODO REMOVE COSOLE LOG
      console.log(request);
      return new ExistingSessionDto(request.data.token);
    } catch (err) {
      const { response } = err;

      return new GazpormErrorDto(
        response.data.code,
        response.data.message,
        response.data.correlation_id,
        response.data.details,
      );
    }
  }

  public async createRegistrationSession(
    client: GazpromClientDto,
  ): Promise<ExistingSessionDto | GazpormErrorDto> {
    const config = this.setHeaders();
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
      return new ExistingSessionDto(request.data.token);
    } catch (err) {
      const { response } = err;
      return new GazpormErrorDto(
        response.data.code,
        response.data.message,
        response.data.correlation_id,
        response.data.details,
      );
    }
  }

  public async getSubscriptionStatus(
    clientId: string,
  ): Promise<SubscribtionStatusDto | GazpormErrorDto> {
    const config = this.setHeaders();
    let subscibtionStatus: SubscribtionStatusDto | GazpormErrorDto;

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${clientId}/user-promotions?filter.public_ids=${this.promoFilter}`,
          config,
        ),
      );

      return new SubscribtionStatusDto(request.data.items, request.data.count);
    } catch (err) {
      const { response } = err;
      return new GazpormErrorDto(
        response.data.code,
        response.data.message,
        response.data.correlation_id,
        response.data.details,
      );
    }
  }

  public async updateStatus(
    clientId: string,
    data: UpdateStatusDto,
  ): Promise<GazpromUpdate | GazpormErrorDto> {
    const config = this.setHeaders();

    try {
      const request: AxiosResponse = await firstValueFrom(
        this.httpService.patch(
          `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${clientId}`,
          data,
          config,
        ),
      );
      return new GazpromUpdate(request.status, request.data);
    } catch (err) {
      const { response } = err;
      return new GazpormErrorDto(
        response.data.code,
        response.data.message,
        response.data.correlation_id,
        response.data.details,
      );
    }
  }

  private setHeaders(): { headers: { Authorization: string } } {
    return {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
  }
}
