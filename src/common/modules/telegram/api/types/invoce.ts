export type TTelegramInvoiceParams = {
  title: string; // Product name, 1-32 characters
  description: string; // Product description, 1-255 characters
  payload: string; // Bot-defined invoice payload, 1-128 bytes
  provider_token?: string; // Payment provider token, obtained via @BotFather
  currency: string; // Three-letter ISO 4217 currency code
  prices: TTelegramInvoiceLabeledPrice[]; // Price breakdown
  max_tip_amount?: number; // The maximum accepted amount for tips in the smallest units of the currency
  suggested_tip_amounts?: number[]; // A list of suggested amounts of tip in the smallest units of the currency
  provider_data?: string; // JSON-encoded data about the invoice
  photo_url?: string; // URL of the product photo for the invoice
  photo_size?: number; // Photo size in bytes
  photo_width?: number; // Photo width
  photo_height?: number; // Photo height
  need_name?: boolean; // Pass True if you require the user's full name to complete the order
  need_phone_number?: boolean; // Pass True if you require the user's phone number to complete the order
  need_email?: boolean; // Pass True if you require the user's email address to complete the order
  need_shipping_address?: boolean; // Pass True if you require the user's shipping address to complete the order
  send_phone_number_to_provider?: boolean; // Pass True if the user's phone number should be sent to the provider
  send_email_to_provider?: boolean; // Pass True if the user's email address should be sent to the provider
  is_flexible?: boolean; // Pass True if the final price depends on the shipping method
};

type TTelegramInvoiceLabeledPrice = {
  label: string;
  amount: number;
};

export type TTelegramInvoiceResponse = {
  ok: boolean;
  result?: string;
};
