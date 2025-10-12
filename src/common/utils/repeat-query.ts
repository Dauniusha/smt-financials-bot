import { Logger } from '@nestjs/common';
import { InternalException } from '../exceptions';
import { AxiosError } from 'axios';
import { waitPeriod } from './wait';

/**
 * @param query repeatable query
 * @param attempts total number of attempts (one or more)
 * @param delay started delay between attempts (using progressive timeout)
 */
export async function repeatQuery<T>(
  query: () => Promise<T>,
  attempts: number,
  delay: number,
  logger: Logger,
): Promise<T> {
  if (attempts < 1) {
    throw new InternalException('Аt least one attempt is allowed');
  }

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await query();
      return result;
    } catch (error) {
      if (!(error instanceof AxiosError)) throw error;

      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      if (attempt === attempts) throw error;

      logger.verbose(`Error fetching query data: ${error.message}`);

      await waitPeriod(delay * attempt);
    }
  }
}
