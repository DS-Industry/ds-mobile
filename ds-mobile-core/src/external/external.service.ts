import { Injectable } from '@nestjs/common';
import { GazpormService } from './gazporm/gazporm.service';

@Injectable()
export class ExternalService {
  constructor(private readonly gazpromService: GazpormService) {}
}
