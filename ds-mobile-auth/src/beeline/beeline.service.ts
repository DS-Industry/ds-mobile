import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as url from 'url';
import { AuthentificationException } from '../common/exceptions/authentification.exception';
import { SendSmsResponseDto } from '../dto/res/send-sms-response.dto';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class BeelineService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async send(
    message: string,
    target: string,
  ): Promise<Observable<SendSmsResponseDto>> {
    const header: any = this.setHeaders();
    const params: string = this.setParams(message, target);
    try {
      return await this.httpService
        .post(
          `${this.configService.get<string>('BEELINE_URL')}`,
          params,
          header,
        )
        .pipe(
          map((axiosResponse: AxiosResponse) => {
            return { message: 'Success', to: target };
          }),
        );
    } catch (e) {
      throw new AuthentificationException([`Error sending otp to ${target}`]);
    }
  }

  private setParams(message: string, target: string): string {
    const params = {
      user: this.configService.get<string>('BEELINE_LOGIN'),
      pass: this.configService.get<string>('BEELINE_PSWD'),
      action: 'post_sms',
      message: message,
      target: target,
      sender: this.configService.get<string>('BEELINE_SENDER'),
    };

    return new url.URLSearchParams(params).toString();
  }

  /**
   * Set headers for the request
   * @private
   */
  private setHeaders(): {
    headers: { 'Content-Type': string; Accept: string };
  } {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/xml',
      },
    };
  }
}
