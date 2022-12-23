import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { YandexClientException } from '@/common/exceptions';
import { SendYandexStatusRes } from '@/yandex/dto/res/send-yandex-status-res.dto';

@Injectable()
export class YandexService {
  private apiKey: string;
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('YANDEX_BASE_URL');
    this.apiKey = configService.get<string>('YANDEX_API_KEY');
  }

  public async accept(orderId: string): Promise<number> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/carwash/order/accept?apikey=${this.apiKey}&orderId=${orderId}`,
        ),
      );

      return response.status;
    } catch (e: any) {
      const error: AxiosError = e;
      const response: SendYandexStatusRes = {
        code: error.response.status,
        error: error.code,
        message: error.message,
      };
      throw new YandexClientException(error.response.status, response, {
        reason: error.stack,
      });
    }
  }

  public async canceled(orderId: string, reason: string): Promise<number> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/carwash/order/accept?apikey=${this.apiKey}&orderId=${orderId}&reason=${reason}`,
        ),
      );
      return response.status;
    } catch (e: any) {
      const error: AxiosError = e;
      const response: SendYandexStatusRes = {
        code: error.response.status,
        error: error.code,
        message: error.message,
      };
      throw new YandexClientException(error.response.status, response, {
        reason: error.stack,
      });
    }
  }

  public async completed(
    orderId: string,
    sum: number,
    extendedOrderId: number,
    extendedDate: Date,
  ): Promise<number> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/carwash/order/accept?apikey=${this.apiKey}&orderId=${orderId}&sum=${sum}&extendedOrderId=${extendedOrderId}&extendedDate=${extendedDate}`,
        ),
      );
      return response.status;
    } catch (e: any) {
      const error: AxiosError = e;
      const response: SendYandexStatusRes = {
        code: error.response.status,
        error: error.code,
        message: error.message,
      };
      throw new YandexClientException(error.response.status, response, {
        reason: error.stack,
      });
    }
  }
}
