import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './model/client.model';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async getClientByTokenId(tokenId: string) {
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

    return client;
  }
}
