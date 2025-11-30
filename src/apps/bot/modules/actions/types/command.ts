import { Context } from 'grammy';
import { CommandRegisterParams } from './command-register.params';

export interface Command extends CommandRegisterParams {
  execute(ctx: Context): void | Promise<void>;
}
