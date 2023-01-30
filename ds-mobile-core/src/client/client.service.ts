import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './model/client.model';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ClientDto } from './dto/core/client.dto';
import { GetClientByTokensResponseDto } from './dto/res/get-client-by-tokens-response.dto';
import { ClientStatus } from '../common/enums/client-status.enum';
import { DeleteClientDto } from './dto/res/delete-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async getClientByTokenId(
    tokenId: string,
  ): Promise<GetClientByTokensResponseDto> {
    const response: GetClientByTokensResponseDto =
      new GetClientByTokensResponseDto();
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.cards', 'cards')
      .where('client.tokenId = :tokenId', { tokenId: tokenId })
      .select([
        'client.clientId',
        'client.correctPhone',
        'cards.devNomer',
        'cards.nomer',
      ])
      .getOne();

    const { clientId, correctPhone, cards } = client;

    response.clientId = clientId;
    response.correctPhone = correctPhone;
    response.devNomer = cards[0].devNomer;
    response.nomer = cards[0].nomer;
    return response;
  }

  async getClientByApiKey(apiKey: string) {
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.apiKeys', 'apiKeys')
      .where('apiKeys.apiKey = :apiKey', { apiKey: apiKey })
      .select(['client.clientId', 'client.correctPhone', 'apiKeys.apiKey'])
      .getOne();

    return client;
  }

  async deleteClient(clientId: number): Promise<DeleteClientDto> {
    const response: DeleteClientDto = new DeleteClientDto();
    const client = await this.clientRepository.update(
      { clientId: clientId },
      {
        tag: ClientStatus.DELETED,
        isActivated: 0,
        isTokeValid: '0',
      },
    );

    if (!client) throw new BadRequestException();
    response.status = HttpStatus.OK;
    response.message = 'Success';

    return response;
  }
}
