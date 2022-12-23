import {
  Request,
  Response,
  All,
  Controller,
  Next,
} from '@nestjs/common';
import express from 'express';
import { createBullBoard, ExpressAdapter } from '@bull-board/express';
import { getBullBoardQueues } from '@/bull-admin/bull-board-queue';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';

@Controller('/queues/admin')
export class BullAdminController {
  @All('*')
  admin(
    @Request() req: express.Request,
    @Response() res: express.Response,
    @Next() next: express.NextFunction,
  ) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/v1/queues/admin');
    const queues = getBullBoardQueues();
    const router = serverAdapter.getRouter() as express.Express;

    const { addQueue } = createBullBoard({
      queues: [],
      serverAdapter,
    });

    queues.forEach((queue: BaseAdapter) => {
      addQueue(queue);
    });

    const entryPointPath = '/api/v1/queues/admin/';
    req.url = req.url.replace(entryPointPath, '/');
    router(req, res, next);
  }
}
