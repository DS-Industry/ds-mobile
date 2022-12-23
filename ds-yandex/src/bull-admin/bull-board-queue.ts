import { Injectable } from '@nestjs/common';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';

@Injectable()
export class BullBoardQueue {}

export const queuePool: Set<Queue> = new Set<Queue>();

export const getBullBoardQueues = (): BaseAdapter[] => {
  const bullBoardQueues = [...queuePool].reduce((acc: BaseAdapter[], val) => {
    acc.push(new BullAdapter(val));
    return acc;
  }, []);
  return bullBoardQueues;
};
