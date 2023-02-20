import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { createDeflateRaw } from 'zlib';
@Injectable()
export class ClientCreateListener {
  constructor(private readonly clientService: ClientService) {}
  @OnEvent('client.created', { async: true })
  handleClientCreatedEvent(event: any) {
    this.clientService.create(event);
  }
}
