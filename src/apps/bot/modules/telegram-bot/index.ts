import { Middleware, Context, Filter, FilterQuery, Bot } from 'grammy';
import { composer, USE_WEBHOOKS } from './grammy-bot';
export { GBot } from './grammy-bot';

export function on<Q extends FilterQuery>(
  bot: Bot,
  filter: Q | Q[],
  ...middleware: Array<Middleware<Filter<Context, Q>>>
) {
  middleware.forEach((m) => {
    if (USE_WEBHOOKS) {
      bot.on(filter, m);
    } else {
      composer.on(filter, m);
    }
  });
}
