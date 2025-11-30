import { Context } from 'grammy';

export enum CallbackType {
  ApproveFinances = 'approveFinances',
  RejectFinances = 'rejectFinances',
}

export interface CallbackHandler<Payload = Record<string, unknown>> {
  readonly type: CallbackType;

  handle(data: Payload, ctx: Context): void | Promise<void>;
}
