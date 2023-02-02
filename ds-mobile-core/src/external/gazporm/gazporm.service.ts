import {Injectable, UseFilters} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExistingSessionDto } from '../dto/res/existing-session.dto';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GazpromException } from '../../common/exceptions/gazprom.exception';

@UseFilters()
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

  public async getExistingSession(phone: string): Promise<ExistingSessionDto> {
    const config = this.setHeaders();
    let response: ExistingSessionDto;

    try {
      const request: AxiosResponse<ExistingSessionDto, unknown> =
        await firstValueFrom(
          this.httpService.post(
            `${this.baseUrl}/v1/partners/${this.partnerId}/clients/${phone}/create/session,`,
            config,
          ),
        );

      response = request.data;
    } catch (err) {
      const { res } = err;
      throw new GazpromException(res.statusCode, res.statusMessage);
    }

    return response;
  }

  public async createRegistrationSession(client: any) {}

  public async getSubscriptionStatus(clientId: string) {}

  private setHeaders(): { headers: { Authorization: string } } {
    return {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
  }
}
