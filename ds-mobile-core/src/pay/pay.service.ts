import { Injectable } from '@nestjs/common';
import { AddPaymentRequestDto } from './dto/req/add-payment-request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import { DataSource } from 'typeorm';
import { AddPaymentResponse } from './dto/res/add-payment-response.dto';

@Injectable()
export class PayService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async addPayment(
    addPaymentRequest: AddPaymentRequestDto,
  ): Promise<AddPaymentResponse> {
    const addPaymentResponse: AddPaymentResponse = new AddPaymentResponse();
    const addPyamentQuery = `begin :p0 := cwash.PAY_OPER_PKG.add_oper_open(:p1, :p2, :p3, :p4, :p5, :p6); end;`;
    const date = new Date(addPaymentRequest.date);

    const runAddPyamentQuery = await this.dataSource.query(addPyamentQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      addPaymentRequest.nomer,
      addPaymentRequest.email,
      addPaymentRequest.phone,
      addPaymentRequest.operSum,
      addPaymentRequest.extId,
      date,
    ]);

    addPaymentResponse.id = runAddPyamentQuery[0];
    return addPaymentResponse;
  }
}
