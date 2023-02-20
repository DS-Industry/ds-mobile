import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entity/client.entity';
import { Repository } from 'typeorm';
import { CreateClientRequestDto } from '../dto/req/create-client-request.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  public async create(data: CreateClientRequestDto) {
    const client: Client = this.clientRepository.create({
      name: data.name,
      phone: data.phone,
      correctPhone: data.correctPhone,
      ...(data.email && { email: data.email }),
      ...(data.inn && { inn: data.inn }),
      ...(data.genderId && { genderId: data.genderId }),
      ...(data.clientTypeId && { clientTypeId: data.clientTypeId }),
      ...(data.birthday && { birthday: data.birthday }),
      insDate: new Date(Date.now()),
      activationDate: new Date(Date.now()),
    });

    await this.clientRepository.save(client);
  }
}
