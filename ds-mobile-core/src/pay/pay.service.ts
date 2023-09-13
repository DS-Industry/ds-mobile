import { Inject, Injectable, LoggerService, Logger } from '@nestjs/common';
import { AddPaymentRequestDto } from './dto/req/add-payment-request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import { DataSource } from 'typeorm';
import { AddPaymentResponse } from './dto/res/add-payment-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PayService {
  private readonly logger = new Logger();
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource /*     @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService, */,
  ) {}

  public async addPayment(
    addPaymentRequest: AddPaymentRequestDto,
    user: any,
  ): Promise<AddPaymentResponse> {
    const addPaymentResponse: AddPaymentResponse = new AddPaymentResponse();
    const addPyamentQuery = `begin :p0 := cwash.PAY_OPER_PKG.add_oper_open(:p1, :p2, :p3, :p4, :p5, :p6); end;`;
    const date = new Date(addPaymentRequest.date);
    this.logger.log(
      `Success money deposit request client: ${JSON.stringify(
        user,
      )}  Request Body: ${JSON.stringify(addPaymentRequest)} `,
    );
    const runAddPyamentQuery = await this.dataSource.query(addPyamentQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      addPaymentRequest.nomer,
      addPaymentRequest.email,
      addPaymentRequest.phone,
      Math.round(addPaymentRequest.operSum),
      addPaymentRequest.extId,
      date,
    ]);
    addPaymentResponse.id = runAddPyamentQuery[0];
    return addPaymentResponse;
  }
}
