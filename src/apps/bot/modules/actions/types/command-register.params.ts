import { Command } from './command';

export type CommandRegisterParams = {
  name: string;
  description: string;
  isVisible: boolean;
  execute: Command['execute'];
};
