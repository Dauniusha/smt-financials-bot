import { ConfigurableModuleBuilder } from '@nestjs/common';
import { TelegramBotModuleOptions } from './types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TelegramBotModuleOptions>().build();
