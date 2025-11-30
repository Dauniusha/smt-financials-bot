export const mainLocale = 'ru';

export const locales = {
  en: {
    welcome: 'Hey, {{username}}! 🤙🏾',
    requestFinanceInfo: `
      To request finance send a details in the examples format:
      <blockquote>
Value: 12,12
Purpose: Birthdays
Comment: September birthday gifts
Payment method: Cash
      </blockquote>
    `,
    requestFinanceSent: `Request successfully was sent! 💸`,
    requestFinanceAdminNotification: `Got new request for {{purpose}} from {{user}}! ✌🏾`,
    approveRequestBtn: 'Approve ✔️',
    approveRequestNotification: `Your request for {{purpose}} was approved! 🥳`,
    adminApproveRequestNotification: `Request for {{purpose}} was approved 🫱🏾‍🫲🏻`,
    rejectRequestBtn: 'Reject ❌',
    rejectRequestNotification: `Your request for {{purpose}} was rejected, contact with {{reviewer}} for details! 🙈`,
    adminRejectRequestNotification: `Request for {{purpose}} from {{requester}} был отклонен! 🤕`,
  },
  ru: {
    welcome: 'Привет, {{username}}! 🤙🏾',
    requestFinanceInfo: `
      Чтобы запросить финансы отправь описание в следующем формате (можно скопировать):
      <blockquote>
Сумма: 12,12
Цель: Дни рождения
Комментарий: Подарки для сентябрьских
Способ оплаты: Наличкой / ЕРИП Альфа-Банк, 123...
      </blockquote>
    `,
    requestFinanceSent: `Запрос успешно отправлен! 💸`,
    requestFinanceAdminNotification: `Получен новый запрос на {{purpose}} от {{user}}! ✌🏾`,
    approveRequestBtn: 'Исполнено ✔️',
    approveRequestNotification: `Твой запрос на {{purpose}} был исполнен! 🥳`,
    adminApproveRequestNotification: `Запрос на {{purpose}} был исполнен 🫱🏾‍🫲🏻`,
    rejectRequestBtn: 'Отклонить ❌',
    rejectRequestNotification: `Твой запрос на {{purpose}} был отклонен, напиши {{reviewer}} за подробностями! 🙈`,
    adminRejectRequestNotification: `Запрос на {{purpose}} от {{requester}} был отклонен! 🤕`,
  },
} as const;
