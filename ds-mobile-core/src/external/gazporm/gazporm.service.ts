import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GazpormService {
  constructor(private readonly httpService: HttpService) {}
}
