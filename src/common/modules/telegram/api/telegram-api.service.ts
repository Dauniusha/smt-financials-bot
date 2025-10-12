import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ITelegramConfig } from '../../../configs/telegram.config';
import { ConfigNames } from '../../../types/enums/configNames.enum';
import { TTelegramChatMember } from './types/chat.member';
import {
  TTelegramInvoiceParams,
  TTelegramInvoiceResponse,
} from './types/invoce';

@Injectable()
export class TelegramApiService {
  private readonly config: ITelegramConfig;
  private readonly protectedAxios: AxiosInstance;
  private readonly logger = new Logger(TelegramApiService.name);

  constructor(private readonly configService: ConfigService) {
    this.config = configService.getOrThrow<ITelegramConfig>(
      ConfigNames.TELEGRAM,
    );

    this.protectedAxios = axios.create({
      baseURL: `${this.config.apiBaseUrl}/bot${this.config.botToken}`,
    });
  }

  async sendMessage(chatId: number, text: string) {
    await this.protectedAxios.post(`/sendMessage`, {
      chat_id: chatId,
      text,
    });
  }

  async getChatMember(
    chatId: number,
    userId: number,
  ): Promise<{ ok: boolean; result: TTelegramChatMember }> {
    try {
      const response = await this.protectedAxios.get(`/getChatMember`, {
        params: {
          chat_id: chatId,
          user_id: userId,
        },
      });
      if (response.status !== 200) {
        this.logger.warn(
          `Non 200 response received calling getChatMember`,
          response.data,
        );
        return null;
      }
      return response.data;
    } catch (err) {
      this.logger.error(`Error calling getChatMember`, err);
      return null;
    }
  }
}
