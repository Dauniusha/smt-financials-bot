import { Context } from 'grammy';

export interface Handler {
  handleMessage(ctx: Context): void | Promise<void>;
}
