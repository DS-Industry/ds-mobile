import { Injectable } from '@nestjs/common';
import { DsCloudService } from '../ds-cloud/ds-cloud.service';

@Injectable()
export class CoreService {
  constructor(private readonly dsCloudService: DsCloudService) {}

  public async getCarWashList() {
    return await this.dsCloudService.getCarWashList();
  }
}
