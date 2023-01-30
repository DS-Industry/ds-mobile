import {
  Controller,
  Delete,
  HttpCode,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CardBalanceRequest } from '../card/dto/req/card-balance-request.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Delete()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async deleteClient(@Query() query: CardBalanceRequest, @Req() req) {
    const { user } = req;
    return this.clientService.deleteClient(user.clientId);
  }
}
